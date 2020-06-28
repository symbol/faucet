import {
    Account,
    Address,
    Mosaic,
    UInt64,
    EmptyMessage,
    TransferTransaction,
    Deadline,
    MosaicId,
    RepositoryFactory,
    TransactionType,
    TransactionGroup
} from "symbol-sdk"
import { of, forkJoin } from "rxjs"
import { map, mergeMap, filter, toArray, catchError } from "rxjs/operators"
import { IAppConfig } from "../bootstrap"

const toRelativeAmount = (amount: number, divisibility: number) => amount / Math.pow(10, divisibility)

const toAbsoluteAmount = (amount: number, divisibility: number) => amount * Math.pow(10, divisibility)

const getMosaicsRandomAmount = (faucetBalance: number) => {
    const max = faucetBalance * 0.15
    const min = faucetBalance * 0.1
    const absoluteAmount = Math.random() * (max - min) + min
    return Math.round(absoluteAmount)
}

const getNativeCurrencyRandomAmount = (faucetBalance: number, minOut: number,  maxOut: number) => {
    const absoluteAmount =  Math.min(Math.min(faucetBalance, maxOut), Math.random() * (minOut - maxOut + 1) + maxOut)
    return Math.round(absoluteAmount)
}

export const handler = (conf: IAppConfig) => {
    return async (req: any, res: any, next: any) => {
        const { recipient, amount, selectedMosaics } = req.body
        console.debug({recipient, amount, selectedMosaics})
        if (typeof recipient !== 'string' || recipient.length !== 39)
            throw new Error(`recipient address invalid.`)

        if (typeof amount !== 'number')
            throw new Error(`amount format invalid.`)

        if (!Array.isArray(selectedMosaics))
            throw new Error(`mosaics is not array.`)

        const mosaicIds = selectedMosaics.map(mosaic => new MosaicId(mosaic))
        const repositoryFactory: RepositoryFactory = conf.REPOSITORY_FACTORY
        const faucetAccount: Account = conf.FAUCET_ACCOUNT
        const recipientAddress: Address = Address.createFromRawAddress(recipient)
        const networkType = await repositoryFactory.getNetworkType().toPromise()
        const generationHash = await repositoryFactory.getGenerationHash().toPromise()
        const feeMultiplier = await (await repositoryFactory.createNetworkRepository().getTransactionFees().toPromise()).highestFeeMultiplier

        forkJoin(
            repositoryFactory.createNamespaceRepository().getMosaicsNames(mosaicIds),
            repositoryFactory.createMosaicRepository().getMosaics(mosaicIds),
            repositoryFactory.createAccountRepository().getAccountInfo(faucetAccount.address),
            repositoryFactory.createAccountRepository().getAccountInfo(recipientAddress).pipe(
                catchError(error => {
                    console.error({ error })
                    return of(null)
                })
            ),
            repositoryFactory.createTransactionRepository().search({
                group: TransactionGroup.Unconfirmed,
                address: faucetAccount.address,
            }).pipe(
                mergeMap(_ => _.data),
                filter(tx => tx.type === TransactionType.TRANSFER),
                map(_ => _ as TransferTransaction),
                filter(tx => tx.recipientAddress.equals(recipientAddress)),
                toArray(),
                catchError(error => {
                    console.error({ error })
                    return of([])
                })
            )
        )
        .pipe(
            map(results => {
                const [requestMosaicName, requestMosaicInfo, faucetAccountInfo, recipientAccountInfo, unconfirmedTransactions ] = results

                const requestMosaicsFromFaucetAccount = faucetAccountInfo.mosaics.filter(mosaic => requestMosaicInfo.map(mosaicInfo => mosaicInfo.id.toHex()).includes(mosaic.id.toHex()))

                if (!requestMosaicInfo.length)
                    throw new Error(`Requested mosaic is not available in network.`)

                if (!requestMosaicsFromFaucetAccount.length)
                    throw new Error(`Requested mosaic is not available in faucet account.`)

                if (conf.BLACKLIST_MOSAICIDS.filter(mosaicHex => requestMosaicInfo.map(mosaicInfo => mosaicInfo.id.toHex()).includes(mosaicHex)).length)
                    throw new Error(`Requested mosaic is blacklisted.`)

                if (unconfirmedTransactions.length >= conf.MAX_UNCONFIRMED)
                    throw new Error(
                        `Too many unconfirmed claiming.
                        Please wait ${unconfirmedTransactions.length} transactions confirmed.`)

                for (let mosaic of requestMosaicsFromFaucetAccount) {
                    if (mosaic.id.toHex() !== conf.NATIVE_CURRENCY_ID){
                        if (mosaic.amount.compact() <= 0)
                            throw new Error(`Faucet balance not enought to pay out.`)
                    }
                    else {
                        // XYM Check
                        const nativeCurrencyMosaicInfo = requestMosaicInfo.find(mosaicInfo => mosaicInfo.id.equals(mosaic.id))

                        if (!nativeCurrencyMosaicInfo)
                            throw new Error(`Native currency mosaic not found.`)

                        const nativeCurrencyBalance = toRelativeAmount(mosaic.amount.compact(), nativeCurrencyMosaicInfo.divisibility)

                        const maxOut = toRelativeAmount(conf.NATIVE_CURRENCY_OUT_MAX, nativeCurrencyMosaicInfo.divisibility)
                        const minOut = toRelativeAmount(conf.NATIVE_CURRENCY_OUT_MIN, nativeCurrencyMosaicInfo.divisibility)

                        // Check recipientBalanceMosaic
                        if (recipientAccountInfo) {
                            for (let recipientBalance of recipientAccountInfo.mosaics) {
                                if (recipientBalance.id.equals(mosaic.id))
                                    if (recipientBalance.amount.compact() > conf.MAX_BALANCE)
                                        throw new Error(`Your account already has enough balance for ${conf.NATIVE_CURRENCY_NAME}`)
                            }
                        }

                        // Check Request Amount if More than maxOut
                        if(amount > maxOut)
                            throw new Error(`${conf.NATIVE_CURRENCY_NAME} faucet available from ${minOut} to ${maxOut}`)

                        // Check Request Amount
                        if (amount > nativeCurrencyBalance)
                            throw new Error(`Faucet balance not enought to pay out.`)
                    }
                }

                const requestedMosicList = requestMosaicsFromFaucetAccount.map(mosaic => {
                    const mosaicDivisibility = requestMosaicInfo.find(mosaicInfo => mosaicInfo.id.equals(mosaic.id))

                    if (!mosaicDivisibility)
                        throw new Error(`Error occur during prepare Mosaic.`)

                     const randomAmount = mosaic.id.toHex() === conf.NATIVE_CURRENCY_ID ?
                        toAbsoluteAmount(amount, mosaicDivisibility.divisibility) || getNativeCurrencyRandomAmount(mosaic.amount.compact(), conf.NATIVE_CURRENCY_OUT_MIN, conf.NATIVE_CURRENCY_OUT_MAX) :
                        getMosaicsRandomAmount(mosaic.amount.compact())

                    return new Mosaic(mosaic.id, UInt64.fromUint(randomAmount))
                } )

                const transaction = TransferTransaction.create(
                    Deadline.create(),
                    recipientAddress,
                    requestedMosicList,
                    EmptyMessage,
                    networkType
                    ).setMaxFee(feeMultiplier > 0 ? feeMultiplier : 1000)

                const transferMosaics = requestedMosicList.map(mosaic => {
                    const mosaicName: any = requestMosaicName.find(mosaicName => mosaicName.mosaicId.equals(mosaic.id))
                    const mosaicInfo: any = requestMosaicInfo.find(mosaicInfo => mosaicInfo.id.equals(mosaic.id))
                    const name = mosaicName.names.length ? mosaicName.names[0].name : mosaicName.mosaicId.id.toHex()

                    return {
                       amount: toRelativeAmount(mosaic.amount.compact(), mosaicInfo.divisibility),
                       name: name
                    }
                })

                const signedTx = faucetAccount.sign(transaction,generationHash)

                repositoryFactory.createTransactionRepository().announce(signedTx)

                return {
                    mosaics: transferMosaics,
                    txHash: signedTx.hash
                }
            })
        ).subscribe(
            result => res.json(result),
            error => {
                console.log(error.message)
                res.status(422).json({message: error.message})
              }
            )
    }
}

export default handler