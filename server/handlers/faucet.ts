import { map, concatMap } from "rxjs/operators"
import { combineLatest } from 'rxjs'
import { IAppConfig } from "../bootstrap"
import { MosaicService } from "symbol-sdk"

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
                ...mosaicView,
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
          const faucet = {
            // drained,
            network: conf.NETWORK_TYPE,
            generationHash: conf.GENERATION_HASH,
            apiUrl: conf.API_URL,
            publicUrl: conf.PUBLIC_URL || conf.API_URL,
            mosaicFQN: 'symbol.xym',
            mosaicId: '747B276C30626442',
            address: conf.FAUCET_ACCOUNT.address.pretty(),
            blackListMosaics: conf.BLACK_LIST_MOSAICS,
            mosaicList: mosaicList,
            filterMosaics: mosaicList.filter(mosaic => conf.BLACK_LIST_MOSAICS.indexOf(mosaic.mosaicId) === -1)
          }

          res.data = { faucet }
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
