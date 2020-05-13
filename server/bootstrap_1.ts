import {
    Account,
    RepositoryFactoryHttp,
    RepositoryFactory
  } from 'symbol-sdk'

  import { env } from "./libs"

  export interface IAppConfig {
    DEFAULT_NODE: string,
    NATIVE_CURRENCY_NAME: string,
    NATIVE_CURRENCY_ID: string,
    NATIVE_CURRENCY_OUT_MIN: number
    NATIVE_CURRENCY_OUT_MAX: number
    MAX_FEE: number
    MAX_UNCONFIRMED: number
    MAX_BALANCE: number
    FAUCET_ACCOUNT: Account,
    BLACKLIST_MOSAICIDS: string[],
    EXPLORER_URL: string,
    REPOSITORY_FACTORY: RepositoryFactory
  }

  const repositoryFactory = new RepositoryFactoryHttp(env.DEFAULT_NODE)

  export const init = async () => {
    const config: IAppConfig = {
        DEFAULT_NODE: env.DEFAULT_NODE,
        NATIVE_CURRENCY_NAME: env.NATIVE_CURRENCY_NAME,
        NATIVE_CURRENCY_ID: env.NATIVE_CURRENCY_ID,
        NATIVE_CURRENCY_OUT_MAX: env.NATIVE_CURRENCY_OUT_MAX,
        NATIVE_CURRENCY_OUT_MIN: env.NATIVE_CURRENCY_OUT_MIN,
        MAX_FEE: env.MAX_FEE,
        MAX_UNCONFIRMED: env.MAX_UNCONFIRMED,
        MAX_BALANCE: env.ENOUGH_BALANCE,
        FAUCET_ACCOUNT: Account.createFromPrivateKey(
            env.FAUCET_PRIVATE_KEY as string,
            await repositoryFactory.getNetworkType().toPromise()
        ),
        BLACKLIST_MOSAICIDS: env.BLACKLIST_MOSAIC_ID,
        EXPLORER_URL: env.EXPLORER_URL,
        REPOSITORY_FACTORY: repositoryFactory
    }
    return config
  }

  export default {
    init
  }
