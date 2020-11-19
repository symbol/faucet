import { Account, RepositoryFactoryHttp, RepositoryFactory, NetworkType } from 'symbol-sdk';
import { timeout } from 'rxjs/operators';
import { IConfig, Config } from './config';

export interface IApp {
    networkType: NetworkType;
    isNodeHealth: boolean;
    networkGenerationHash: string;
    faucetAccount: Account;
    config: IConfig;
    repositoryFactory: RepositoryFactory;
}

export default class App implements IApp {
    constructor(
        private readonly _repositoryFactory: RepositoryFactory,
        private readonly _config: IConfig,
        private readonly _networkType: NetworkType,
        private readonly _networkGenerationHash: string,
        private readonly _isNodeHealth: boolean,
    ) {}
    public static async init(): Promise<App> {
        const repositoryFactory = new RepositoryFactoryHttp(Config.DEFAULT_NODE);
        const isNodeHealth: boolean = await App.isNodeHealth(repositoryFactory);

        if (!isNodeHealth) {
            return new App(repositoryFactory, Config, NetworkType.TEST_NET, '', isNodeHealth);
        }

        const [networkType, networkGenerationHash] = await Promise.all([
            repositoryFactory.getNetworkType().toPromise(),
            repositoryFactory.getGenerationHash().toPromise(),
        ]);
        return new App(repositoryFactory, Config, networkType, networkGenerationHash, isNodeHealth);
    }

    get networkType(): NetworkType {
        return this._networkType;
    }

    get isNodeHealth(): boolean {
        return this._isNodeHealth;
    }

    get networkGenerationHash(): string {
        return this._networkGenerationHash;
    }

    get config(): IConfig {
        return this._config;
    }

    get faucetAccount(): Account {
        return Account.createFromPrivateKey(this._config.FAUCET_PRIVATE_KEY as string, this._networkType as NetworkType);
    }

    get repositoryFactory(): RepositoryFactory {
        return this._repositoryFactory;
    }

    static isNodeHealth(repositoryFactory: RepositoryFactory): Promise<boolean> {
        return new Promise(resolve => {
            repositoryFactory
                .createNodeRepository()
                .getNodeHealth()
                .pipe(timeout(3000))
                .subscribe(
                    nodeHealth => {
                        if (nodeHealth.apiNode !== 'up' || nodeHealth.db !== 'up') resolve(false);

                        resolve(true);
                    },
                    error => {
                        console.error(error);
                        resolve(false);
                    },
                );
        });
    }
}
