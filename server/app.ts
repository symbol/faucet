import { Account, RepositoryFactoryHttp, RepositoryFactory, NetworkType, CurrencyService } from 'symbol-sdk';
import { timeout } from 'rxjs/operators';
import { IConfig, Config } from './config';
import axios from 'axios';

export interface NodeSearchCriteria {
    nodeFilter: 'preferred' | 'suggested';
    limit: number;
    ssl?: boolean;
}
export interface IApp {
    nodeUrl: string;
    networkType: Promise<NetworkType>;
    isNodeHealth: Promise<boolean>;
    networkGenerationHash: Promise<string>;
    epochAdjustment: Promise<number>;
    faucetAccount: Promise<Account>;
    config: IConfig;
    repositoryFactory: RepositoryFactory;
    currencyService: CurrencyService;
}

export default class App implements IApp {
    constructor(
        private readonly _repositoryFactory: RepositoryFactory,
        private readonly _config: IConfig,
        private readonly _nodeUrl: string,
    ) {}
    public static async init(nodes: string[]): Promise<App> {
        const nodeUrl = nodes.length ? nodes[Math.floor(Math.random() * nodes.length)] : Config.DEFAULT_NODE; //NOSONAR
        const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
        return new App(repositoryFactory, Config, nodeUrl);
    }

    get nodeUrl(): string {
        return this._nodeUrl;
    }

    get networkType(): Promise<NetworkType> {
        // network type is lazily cached in repo factory.
        return this._repositoryFactory.getNetworkType().toPromise();
    }

    get isNodeHealth(): Promise<boolean> {
        // perform a health check when is requested.
        return App.isNodeHealth(this._repositoryFactory);
    }

    get networkGenerationHash(): Promise<string> {
        // generation hash is lazily cached in repo factory.
        return this._repositoryFactory.getGenerationHash().toPromise();
    }

    get epochAdjustment(): Promise<number> {
        return this._repositoryFactory.getEpochAdjustment().toPromise();
    }

    get config(): IConfig {
        return this._config;
    }

    get faucetAccount(): Promise<Account> {
        return this.networkType.then((networkType) => Account.createFromPrivateKey(this._config.FAUCET_PRIVATE_KEY, networkType));
    }

    get repositoryFactory(): RepositoryFactory {
        return this._repositoryFactory;
    }

    get currencyService(): CurrencyService {
        return new CurrencyService(this._repositoryFactory);
    }

    static isNodeHealth(repositoryFactory: RepositoryFactory): Promise<boolean> {
        return new Promise((resolve) => {
            repositoryFactory
                .createNodeRepository()
                .getNodeHealth()
                .pipe(timeout(3000))
                .subscribe(
                    (nodeHealth) => {
                        if (nodeHealth.apiNode !== 'up' || nodeHealth.db !== 'up') resolve(false);

                        resolve(true);
                    },
                    (error) => {
                        console.error(error);
                        resolve(false);
                    },
                );
        });
    }

    static getNodeUrls({ nodeFilter, limit, ssl }: NodeSearchCriteria): Promise<string[]> {
        return new Promise((resolve) => {
            if (Config.STATISTICS_SERVICE_URL && Config.STATISTICS_SERVICE_URL.length) {
                axios
                    .get(`${Config.STATISTICS_SERVICE_URL}nodes`, {
                        params: {
                            nodeFilter,
                            limit,
                            ssl,
                        },
                    })
                    .then((response) => {
                        let nodeUrls: string[] = [];

                        for (const node of response.data) {
                            if (node.apiStatus) {
                                nodeUrls.push(node.apiStatus.restGatewayUrl);
                            }
                        }

                        resolve(nodeUrls);
                    });
            } else {
                console.log('Statistics service URL is not provided');
                resolve([]);
            }
        });
    }
}
