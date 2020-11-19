import { MosaicId, MosaicInfo } from 'symbol-sdk';
import Url from 'url-parse';
import { IApp } from '../app';

export const faucetHandler = (appConfig: IApp) => {
    return async (_req: any, res: any, next: any) => {
        const { repositoryFactory, config, faucetAccount, isNodeHealth } = appConfig;

        if (!isNodeHealth) {
            res.error = {
                statusCode: 500,
                message: `${appConfig.config.DEFAULT_NODE} node is offline.`,
            };

            return next();
        }

        const nativeMosaicInfo: MosaicInfo = await repositoryFactory
            .createMosaicRepository()
            .getMosaic(new MosaicId(config.NATIVE_CURRENCY_ID))
            .toPromise();

        const defaultNode = new Url(config.DEFAULT_NODE_CLIENT);
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

        // Todo: Move fetch Faucet account mosaic

        res.data = { networkInfo };
        return next();
    };
};

export default faucetHandler;
