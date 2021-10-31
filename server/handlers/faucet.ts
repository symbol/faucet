import { ServerMiddleware } from '@nuxt/types';
import { MosaicId, NamespaceId, UnresolvedMosaicId, MosaicInfo } from 'symbol-sdk';
import Url from 'url-parse';
import { IApp } from '../app';
import helper from '../helper';

interface Ibalance {
    mosaicId: string;
    amount: number;
    mosaicAliasName: string;
}

export const faucetHandler = (appConfig: IApp): ServerMiddleware => {
    return async (_req: any, res: any, next: any) => {
        const { repositoryFactory, config } = appConfig;
        const isNodeHealth = await appConfig.isNodeHealth;
        if (!isNodeHealth) {
            res.error = Error(`API node is offline.`);
            return next();
        }
        const faucetAccount = await appConfig.faucetAccount;
        try {
            const defaultNode = new Url(appConfig.nodeUrl);

            // Gets native mosaic info and faucet account info.
            const [getCurrencies, accountInfo] = await Promise.all([
                repositoryFactory.getCurrencies().toPromise(),
                repositoryFactory.createAccountRepository().getAccountInfo(faucetAccount.address).toPromise(),
            ]);

            // Build network info object
            const networkInfo = {
                address: faucetAccount.address.pretty(),
                hostname: defaultNode.hostname,
                defaultNode: defaultNode.origin,
                nativeCurrencyMaxOut: config.NATIVE_CURRENCY_OUT_MAX / Math.pow(10, getCurrencies.currency.divisibility),
                nativeCurrencyName: config.NATIVE_CURRENCY_NAME,
                nativeCurrencyId: config.NATIVE_CURRENCY_ID,
                blackListMosaicIds: config.BLACKLIST_MOSAICIDS,
                explorerUrl: config.EXPLORER_URL,
            };

            // Gets resolved mosaic from account.
            const mosaics = await Promise.all(
                accountInfo.mosaics.map(async (mosaic) => {
                    let mosaicId: UnresolvedMosaicId | MosaicId = mosaic.id;
                    if (mosaicId instanceof NamespaceId) {
                        mosaicId =
                            (await repositoryFactory.createNamespaceRepository().getLinkedMosaicId(mosaicId).toPromise()) || mosaic.id;
                    }

                    return {
                        id: new MosaicId(mosaicId.toHex()),
                        amount: mosaic.amount,
                    };
                }),
            );

            const mosaicIds = mosaics.map((mosaic) => mosaic.id);

            // Gets mosaics info and mosaice namespace
            const [mosaicInfos, mosaicNames, chainInfo] = await Promise.all([
                repositoryFactory.createMosaicRepository().getMosaics(mosaicIds).toPromise(),
                repositoryFactory.createNamespaceRepository().getMosaicsNames(mosaicIds).toPromise(),
                repositoryFactory.createChainRepository().getChainInfo().toPromise(),
            ]);

            const balance: Ibalance[] = [];

            for (const mosaic of mosaics) {
                let mosaicInfo: MosaicInfo | undefined = mosaicInfos.find((info) => info.id.equals(mosaic.id));

                if (!mosaicInfo) return;

                // Filter native mosaic
                if (Number(mosaicInfo.duration.toString()) === 0)
                    balance.push({
                        mosaicId: mosaic.id.toHex(),
                        amount: helper.toRelativeAmount(mosaic.amount.compact(), mosaicInfo.divisibility),
                        mosaicAliasName: helper.extractMosaicNamespace(mosaicInfo, mosaicNames),
                    });

                // Filter non expired mosaics
                if (
                    Number(chainInfo.height.toString()) <
                    Number(mosaicInfo.startHeight.toString()) + Number(mosaicInfo.duration.toString())
                )
                    balance.push({
                        mosaicId: mosaic.id.toHex(),
                        amount: helper.toRelativeAmount(mosaic.amount.compact(), mosaicInfo.divisibility),
                        mosaicAliasName: helper.extractMosaicNamespace(mosaicInfo, mosaicNames),
                    });
            }

            // Filter black list mosaics from the account balance.
            const faucetBalance: Ibalance[] = balance.filter((mosaic) => !networkInfo.blackListMosaicIds.includes(mosaic.mosaicId));

            res.data = {
                networkInfo,
                faucetBalance,
            };
        } catch (error) {
            console.log(error);
            res.error = Error(`Init faucet server error.`);
        }

        return next();
    };
};

export default faucetHandler;
