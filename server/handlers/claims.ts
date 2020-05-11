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
    TransactionType
} from "symbol-sdk"
import { of, forkJoin } from "rxjs"
import { map, mergeMap, filter, toArray, catchError } from "rxjs/operators"
import { IAppConfig } from "../bootstrap_1"

export const handler = (conf: IAppConfig) => {
    return async (req: any, res: any, next: any) => {
        const { recipient, amount, mosaicId } = req.body
        console.debug({recipient, amount, mosaicId})

        const repositoryFactory: RepositoryFactory = conf.REPOSITORY_FACTORY
        const faucetAccount: Account = conf.FAUCET_ACCOUNT
        const recipientAddress: Address = Address.createFromRawAddress(recipient)
        const requestMosaicId =  new MosaicId(mosaicId)
        const networkType = await repositoryFactory.getNetworkType().toPromise()
        const generationHash = await repositoryFactory.getGenerationHash().toPromise()

        forkJoin(
            repositoryFactory.createNamespaceRepository().getMosaicsNames([requestMosaicId]),
            repositoryFactory.createMosaicRepository().getMosaic(requestMosaicId),
            repositoryFactory.createAccountRepository().getAccountInfo(faucetAccount.address),
            repositoryFactory.createAccountRepository().getAccountInfo(recipientAddress),
            repositoryFactory.createAccountRepository().getAccountUnconfirmedTransactions(faucetAccount.address).pipe(
                mergeMap(_ => _),
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

                const mosaicName = requestMosaicName[0].names.length > 0 ? requestMosaicName[0].names[0].name : requestMosaicInfo.id.toHex()
                const faucetBalanceMosaic = faucetAccountInfo.mosaics.filter(mosaic => mosaic.id.equals(requestMosaicInfo.id))

                const maxOut = conf.NATIVE_CURRENCY_OUT_MAX / Math.pow(10, requestMosaicInfo.divisibility)
                const minOut = conf.NATIVE_CURRENCY_OUT_MIN / Math.pow(10, requestMosaicInfo.divisibility)

                if (faucetBalanceMosaic.length < 1) {
                    throw new Error(`${mosaicName} mosaic is not available.`)
                }

                let absoluteAmount = amount

                if (amount == 0 || amount ==='') {
                    let balance = faucetBalanceMosaic[0].amount.compact() / Math.pow(10, requestMosaicInfo.divisibility)
                    if (requestMosaicId.toHex() === conf.NATIVE_CURRENCY_ID) {
                        let randomValue = Math.min(Math.min(balance, maxOut), Math.random() * (minOut - maxOut + 1) + maxOut)
                        absoluteAmount = Math.round(randomValue)
                    } else {
                        let randomValue = (Math.random() * (1 - balance/2 + 1) + balance/2) / Math.pow(10, requestMosaicInfo.divisibility)
                        absoluteAmount = Math.round(randomValue)
                    }
                }

                if (requestMosaicId.toHex() === conf.NATIVE_CURRENCY_ID) {
                    if(absoluteAmount > maxOut) {
                        throw new Error(`${mosaicName} faucet available from ${minOut} to ${maxOut}`)
                    }
                }

                if (conf.BLACKLIST_MOSAICIDS.indexOf(requestMosaicId.toHex()) !== -1){
                    throw new Error(`${mosaicName} is blacklisted.`)
                }

                if (unconfirmedTransactions.length >= conf.MAX_UNCONFIRMED){
                    throw new Error(
                      `Too many unconfirmed claiming.
                      Please wait ${unconfirmedTransactions.length} transactions confirmed.`
                    )
                }

                faucetBalanceMosaic.map(mosaic => {
                    const mosaicBalance = mosaic.amount.compact() / Math.pow(10, requestMosaicInfo.divisibility)
                    if (absoluteAmount > mosaicBalance) {
                        throw new Error(`Faucet balance not enought to pay out.`)
                    }
                })

                if (requestMosaicInfo.id.toHex() === conf.NATIVE_CURRENCY_ID) {
                    const recipientBalanceMosaic = recipientAccountInfo.mosaics.filter(mosaic => mosaic.id.equals(requestMosaicInfo.id))

                    if(recipientBalanceMosaic.length > 0 ) {
                        recipientBalanceMosaic.map(mosaic => {
                            let maxBalance = conf.MAX_BALANCE / Math.pow(10, requestMosaicInfo.divisibility)
                            let mosaicBalance = mosaic.amount.compact() / Math.pow(10, requestMosaicInfo.divisibility)
                            if (mosaicBalance > maxBalance){
                                throw new Error(`Your account already has enough balance for ${mosaicName}`)
                            }
                        })
                    }
                }

                let tx = TransferTransaction.create(
                    Deadline.create(),
                    recipientAddress,
                    [new Mosaic (requestMosaicInfo.id,
                        UInt64.fromUint(absoluteAmount*Math.pow(10, requestMosaicInfo.divisibility)))],
                    EmptyMessage,
                    networkType,
                    UInt64.fromUint(conf.MAX_FEE)
                    )

                const signedTx = faucetAccount.sign(tx,generationHash)

                repositoryFactory.createTransactionRepository().announce(signedTx)

                return {
                    mosaic: mosaicName,
                    txHash: signedTx.hash,
                    absoluteAmount
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