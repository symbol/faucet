import { map, concatMap } from "rxjs/operators"
import { combineLatest } from 'rxjs'
import { IAppConfig } from "../bootstrap_1"
import { MosaicService } from "symbol-sdk"
import Url from 'url-parse'

export const handler = (conf: IAppConfig) => {

  const getAccountMosaic = (conf: IAppConfig) => {
    const repositoryFactory = conf.REPOSITORY_FACTORY
      const address = conf.FAUCET_ACCOUNT.address
      const mosaicService = new MosaicService(repositoryFactory.createAccountRepository(), repositoryFactory.createMosaicRepository())

      const mosaicsAmountView = mosaicService.mosaicsAmountViewFromAddress(address)
      const mosaicsNames = mosaicService.mosaicsAmountViewFromAddress(address).pipe(
        map(mosaicsAmountView => mosaicsAmountView.map(mosaic => mosaic.mosaicInfo.id)),
        concatMap(mosaicIds => repositoryFactory.createNamespaceRepository().getMosaicsNames(mosaicIds))
      )

      return combineLatest(mosaicsAmountView, mosaicsNames).pipe(
        map(([mosaicsAmountView, mosaicsNames]) => {
          return mosaicsAmountView.map(mosaicView => {
            const mosaicName = mosaicsNames.find(name => name.mosaicId.equals(mosaicView.mosaicInfo.id))

            let mosaicAliasName = ''

            if(mosaicName) {
              mosaicAliasName = mosaicName.names.length > 0 ? mosaicName.names[0].name : mosaicView.mosaicInfo.id.toHex()
            }

            return {
                // ...mosaicView,
                mosaicId: mosaicView.mosaicInfo.id.toHex(),
                divisibility: mosaicView.mosaicInfo.divisibility,
                amount: mosaicView.amount.compact() / Math.pow(10, mosaicView.mosaicInfo.divisibility),
                mosaicAliasName
              }
          })
        })
      )
  }

  return (_req: any, res: any, next: any) => {
      getAccountMosaic(conf)
      .subscribe(
        mosaicList => {

          const nativeMosaicInfo: any = mosaicList.find(mosaic => mosaic.mosaicId === conf.NATIVE_CURRENCY_ID)
          const defaultNode = new Url(conf.DEFAULT_NODE)

          const faucet = {
            address: conf.FAUCET_ACCOUNT.address.pretty(),
            filterMosaics: mosaicList.filter(mosaic => conf.BLACKLIST_MOSAICIDS.indexOf(mosaic.mosaicId) === -1)
          }

          const networkInfo = {
            hostname: defaultNode.hostname,
            defaultNode: defaultNode.origin,
            nativeCurrencyMaxOut: conf.NATIVE_CURRENCY_OUT_MAX / Math.pow(10, nativeMosaicInfo.divisibility),
            nativeCurrencyName: conf.NATIVE_CURRENCY_NAME,
            nativeCurrencyId: conf.NATIVE_CURRENCY_ID,
            blackListMosaicIds: conf.BLACKLIST_MOSAICIDS,
            explorerUrl: conf.EXPLORER_URL
          }

          res.data = { faucet, networkInfo }
          return next()
        },
        error => {
          res.error = {
            message: error.message
          }
          return next()
        }
      )
    }
}

export default handler
