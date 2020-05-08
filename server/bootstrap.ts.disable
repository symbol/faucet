import {
  Account,
  NetworkType,
  RepositoryFactoryHttp,
  RepositoryFactory
} from 'symbol-sdk'

import { env } from "./libs"

import {
  MosaicService,
  BlockService,
  NodeService
} from './services'

export interface IAppConfig {
  PRIVATE_KEY: string | undefined
  GENERATION_HASH: string
  API_URL: string
  PUBLIC_URL: string
  NETWORK_TYPE: NetworkType
  OUT_MIN: number
  OUT_MAX: number
  OUT_OPT: number
  FEE_MULTIPLIER: number | undefined
  MAX_FEE: number | undefined
  MAX_DEADLINE: number
  MAX_UNCONFIRMED: number
  MAX_BALANCE: number
  WAIT_BLOCK: number
  RECAPTCHA_ENABLED: boolean
  RECAPTCHA_CLIENT_SECRET: string | undefined
  RECAPTCHA_SERVER_SECRET: string | undefined
  RECAPTCHA_ENDPOINT: string
  FAUCET_ACCOUNT: Account,
  BLACK_LIST_MOSAICS: string[],
  REPOSITORY_FACTORY: RepositoryFactory
}

const repositoryFactory = new RepositoryFactoryHttp(env.API_URL)

export const init = async () => {


  // let networkType = env.NETWORK_TYPE || ""
  // if (!/(MIJIN_TEST|MIJIN|TEST_NET|MAIN_NET)/.test(networkType)) {
  //   const nodeService = new NodeService(env.API_URL)
  //   networkType = await nodeService
  //     .getNetworkType()
  //     .toPromise()
  //     .catch(error => "")
  //   if (networkType === "") {
  //     throw new Error('Failed to get NetworkType from API Node')
  //   }

  // }

  let generationHash = await repositoryFactory.getGenerationHash().toPromise()
  let networkType = await repositoryFactory.getNetworkType().toPromise()

  console.info(`Get GenerationHash from API Node: "${generationHash}"`)
  console.info(`Get NetworkType from API Node: "${networkType}"`)


  // const mosaicService = new MosaicService(env.API_URL)
  // let mosaicId: MosaicId | null
  // if (!/[0-9A-Fa-f]{6}/.test(env.MOSAIC_ID)) {
  //   mosaicId = await mosaicService
  //     .getLinkedMosaicId(env.MOSAIC_ID)
  //     .toPromise()
  //     .catch(error => null)
  //   if (mosaicId == null) {
  //     throw new Error('Failed to get MosaicID from API Node')
  //   }
  //   console.info(`Get MosaicID from API Node: "${mosaicId.toHex()}"`)
  // } else {
  //   mosaicId = new MosaicId(env.MOSAIC_ID)
  // }

  // let mosaicFQN = (await mosaicService
  //   .getLinkedNames(mosaicId)
  //   .toPromise()
  // ).join(",")
  // console.info(`Get MosaicFQN from API Node: "${mosaicFQN}"`)

  const config: IAppConfig = { ...env,
      // @ts-ignore WIP
    NETWORK_TYPE: networkType,
    GENERATION_HASH: generationHash,
    FAUCET_ACCOUNT: Account.createFromPrivateKey(
      env.PRIVATE_KEY as string,
      // @ts-ignore WIP
      networkType
    ),
    REPOSITORY_FACTORY: repositoryFactory
  }
  console.debug({ config })
  return config
}

export default {
  init
}
