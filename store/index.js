import axios from 'axios';
import { Listener, Address, RepositoryFactoryHttp } from 'symbol-sdk';

export const state = () => ({
    filterMosaics: [],
    networkInfo: {},
    transactionHash: '',
});

export const getters = {
    getNetworkInfo: (state) => state.networkInfo,
    getTransactionHash: (state) => state.transactionHash,
    getFilterMosaics: (state) => state.filterMosaics,
};

export const mutations = {
    setFilterMosaics: (state, filterMosaics) => {
        state.filterMosaics = filterMosaics;
    },
    setNetworkInfo: (state, networkInfo) => {
        state.networkInfo = networkInfo;
    },
    setTransactionHash: (state, transactionHash) => {
        state.transactionHash = transactionHash;
    },
};

export const actions = {
    nuxtServerInit: ({ commit }, { res, error }) => {
        if (res.error) {
            return error(res.error);
        }

        commit('setNetworkInfo', res.data.networkInfo);
        commit('setFilterMosaics', res.data.faucetBalance);
    },

    claimFaucet: (context, form) => {
        const recipientAddress = Address.createFromRawAddress(form.recipient);

        context.dispatch('openListenser', recipientAddress);

        axios
            .post('/claims', { ...form })
            .then((res) => {
                context.commit('setTransactionHash', res.data.txHash);

                res.data.mosaics.map((mosaic) => {
                    window.$nuxt.$makeToast('info', `Mosaic: ${mosaic.name} - Amount: ${mosaic.amount}`);
                });
                window.$nuxt.$makeToast('info', `Pending Transaction Hash: ${res.data.txHash}`, {
                    noAutoHide: true,
                });
            })
            .catch((error) => {
                console.debug(error);
                window.$nuxt.$makeToast('warning', `${error.response.data.message}`); // Error!
            });
    },

    openListenser: async (context, recipient) => {
        const networkInfo = context.getters.getNetworkInfo;
        const protocol = networkInfo.defaultNode.split(':')[0];
        const wsEndpoint = `${networkInfo.defaultNode.replace(protocol, protocol === 'https' ? 'wss' : 'ws')}/ws`;
        const repositoryFactory = new RepositoryFactoryHttp(networkInfo.defaultNode);

        const listener = new Listener(wsEndpoint, repositoryFactory.createNamespaceRepository(), WebSocket);

        await listener.open();

        listener.unconfirmedAdded(recipient).subscribe((response) => {
            if (context.getters.getTransactionHash === response.transactionInfo.hash) {
                window.$nuxt.$makeToast('success', `Your request is being processed.`);
            }
        });

        listener.confirmed(recipient).subscribe((response) => {
            if (context.getters.getTransactionHash === response.transactionInfo.hash) {
                window.$nuxt.$makeToast('success', `Your request has been processed.`);
                window.$nuxt.$makeToast('success', `View transaction in explorer.`, {
                    noAutoHide: true,
                    href: `${networkInfo.explorerUrl}transactions/${response.transactionInfo.hash}`,
                });

                listener.close();
            }
        });
    },
};
