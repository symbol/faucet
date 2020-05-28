import { IAppConfig } from "../bootstrap"
import { MosaicId, MosaicInfo } from "symbol-sdk"
import Url from 'url-parse'

export const handler = (conf: IAppConfig) => {

   return async (_req: any, res: any, next: any) => {

    const repositoryFactory = conf.REPOSITORY_FACTORY
    const nativeMosaicInfo: MosaicInfo = await repositoryFactory.createMosaicRepository().getMosaic(new MosaicId(conf.NATIVE_CURRENCY_ID)).toPromise()

    const defaultNode = new Url(conf.DEFAULT_NODE)
    const networkInfo = {
      address: conf.FAUCET_ACCOUNT.address.pretty(),
      hostname: defaultNode.hostname,
      defaultNode: defaultNode.origin,
      nativeCurrencyMaxOut: conf.NATIVE_CURRENCY_OUT_MAX / Math.pow(10, nativeMosaicInfo.divisibility),
      nativeCurrencyName: conf.NATIVE_CURRENCY_NAME,
      nativeCurrencyId: conf.NATIVE_CURRENCY_ID,
      blackListMosaicIds: conf.BLACKLIST_MOSAICIDS,
      explorerUrl: conf.EXPLORER_URL
    }

      res.data = { networkInfo }
      return next()
    }
}

export default handler
