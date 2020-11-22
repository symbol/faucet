import { MosaicId, Mosaic, MosaicInfo, Address, NamespaceId, AccountInfo, Account } from 'symbol-sdk';
import Url from 'url-parse';
import { IApp } from '../app';
import helper from '../helper';

interface Ibalance {
    mosaicId: string;
    amount: number;
    mosaicAliasName: string;
}

export const faucetHandler = (appConfig: IApp) => {
    return async (_req: any, res: any, next: any) => {
        const { repositoryFactory, config, faucetAccount, isNodeHealth } = appConfig;

        if (!isNodeHealth) {
            res.error = Error(`API node is offline.`);
            return next();
        }

        try {
            const defaultNode = new Url(config.DEFAULT_NODE_CLIENT);

            const [nativeMosaicInfo, accountInfo] = await Promise.all([
                repositoryFactory.createMosaicRepository().getMosaic(new MosaicId(config.NATIVE_CURRENCY_ID)).toPromise(),
                repositoryFactory.createAccountRepository().getAccountInfo(faucetAccount.address).toPromise(),
            ]);

            const networkInfo = {
                address: faucetAccount.address.pretty(),
                hostname: defaultNode.hostname,
                defaultNode: defaultNode.origin,
                nativeCurrencyMaxOut: config.NATIVE_CURRENCY_OUT_MAX / Math.pow(10, nativeMosaicInfo.divisibility),
                nativeCurrencyName: config.NATIVE_CURRENCY_NAME,
                nativeCurrencyId: config.NATIVE_CURRENCY_ID,
                blackListMosaicIds: config.BLACKLIST_MOSAICIDS,
                explorerUrl: config.EXPLORER_URL,
            };

            const resolvedMosaics = await Promise.all(
                accountInfo.mosaics.map(async (mosaic) => {
                    let mosaicId: MosaicId = mosaic.id;
                    if (mosaic instanceof NamespaceId) {
                        mosaicId = (await repositoryFactory.createNamespaceRepository().getLinkedMosaicId(mosaic).toPromise()) || mosaic.id;
                    }

                    return new Mosaic(mosaicId, mosaic.amount);
                }),
            );

            const resolvedMosaicIds = resolvedMosaics.map((mosaic) => mosaic.id);

            const [mosaicInfos, mosaicNames] = await Promise.all([
                repositoryFactory.createMosaicRepository().getMosaics(resolvedMosaicIds).toPromise(),
                repositoryFactory.createNamespaceRepository().getMosaicsNames(resolvedMosaicIds).toPromise(),
            ]);

            const balance: Ibalance[] = resolvedMosaics.map((mosaic) => {
                let mosaicInfo: any = mosaicInfos.find((info) => info.id.equals(mosaic.id));

                return {
                    mosaicId: mosaic.id.toHex(),
                    amount: helper.toRelativeAmount(mosaic.amount.compact(), mosaicInfo.divisibility),
                    mosaicAliasName: helper.extractMosaicNamespace(mosaicInfo, mosaicNames),
                };
            });

            const faucetBalance: Ibalance[] = balance.filter((mosaic) => !networkInfo.blackListMosaicIds.includes(mosaic.mosaicId));

            res.data = {
                networkInfo,
                faucetBalance,
            };
        } catch (error) {
            res.error = Error(`Init faucet server error.`);
        }

        return next();
    };
};

export default faucetHandler;
