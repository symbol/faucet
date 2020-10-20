import axios from 'axios';
import { map, concatMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Listener, Address, RepositoryFactoryHttp, MosaicService } from 'symbol-sdk';
import Vue from 'vue';

export const state = () => ({
	filterMosaics: [],
	networkInfo: {},
	transactionHash: '',
});

export const getters = {
	getNetworkInfo: state => state.networkInfo,
	getTransactionHash: state => state.transactionHash,
	getFilterMosaics: state => state.filterMosaics,
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
	nuxtServerInit: ({ commit }, { res }) => {
		commit('setNetworkInfo', res.data.networkInfo);
	},

	fetchFaucetBalance: context => {
		const faucetAddress = Address.createFromRawAddress(context.getters.getNetworkInfo.address);
		const networkInfo = context.getters.getNetworkInfo;

		const repositoryFactory = new RepositoryFactoryHttp(networkInfo.defaultNode);
		const mosaicService = new MosaicService(repositoryFactory.createAccountRepository(), repositoryFactory.createMosaicRepository());

		const mosaicsAmountView = mosaicService.mosaicsAmountViewFromAddress(faucetAddress);
		const mosaicsNames = mosaicService.mosaicsAmountViewFromAddress(faucetAddress).pipe(
			map(mosaicsAmountView => mosaicsAmountView.map(mosaic => mosaic.mosaicInfo.id)),
			concatMap(mosaicIds => repositoryFactory.createNamespaceRepository().getMosaicsNames(mosaicIds)),
		);

		return combineLatest(mosaicsAmountView, mosaicsNames)
			.pipe(
				map(([mosaicsAmountView, mosaicsNames]) => {
					return mosaicsAmountView.map(mosaicView => {
						const mosaicName = mosaicsNames.find(name => name.mosaicId.equals(mosaicView.mosaicInfo.id));

						let mosaicAliasName = '';

						if (mosaicName) {
							mosaicAliasName = mosaicName.names.length > 0 ? mosaicName.names[0].name : mosaicView.mosaicInfo.id.toHex();
						}

						return {
							mosaicId: mosaicView.mosaicInfo.id.toHex(),
							divisibility: mosaicView.mosaicInfo.divisibility,
							amount: mosaicView.amount.compact() / 10 ** mosaicView.mosaicInfo.divisibility,
							mosaicAliasName,
						};
					});
				}),
				map(mosaicList => {
					return mosaicList.filter(mosaic => !networkInfo.blackListMosaicIds.includes(mosaic.mosaicId));
				}),
			)
			.subscribe(faucet => context.commit('setFilterMosaics', faucet));
	},

	claimFaucet: (context, form) => {
		const recipientAddress = Address.createFromRawAddress(form.recipient);

		context.dispatch('openListenser', recipientAddress);

		axios
			.post('/claims', { ...form })
			.then(res => {
				context.commit('setTransactionHash', res.data.txHash);

				res.data.mosaics.map(mosaic => {
					Vue.prototype.$nuxt.$makeToast('info', `Mosaic: ${mosaic.name} - Amount: ${mosaic.amount}`);
				});
				Vue.prototype.$nuxt.$makeToast('info', `Pending Transaction Hash: ${res.data.txHash}`, {
					noAutoHide: true,
				});
			})
			.catch(error => {
				console.debug(error);
				Vue.prototype.$nuxt.$makeToast('warning', `${error.response.data.message}`); // Error!
			});
	},

	openListenser: async (context, recipient) => {
		const networkInfo = context.getters.getNetworkInfo;
		const wsEndpoint = `${networkInfo.defaultNode.replace('http', 'ws')}/ws`;
		const repositoryFactory = new RepositoryFactoryHttp(networkInfo.defaultNode);

		const listener = new Listener(wsEndpoint, repositoryFactory.createNamespaceRepository(), WebSocket);

		await listener.open();

		listener.unconfirmedAdded(recipient).subscribe(response => {
			if (context.getters.getTransactionHash === response.transactionInfo.hash)
				{Vue.prototype.$nuxt.$makeToast('success', `Your request is being processed.`);}
		});

		listener.confirmed(recipient).subscribe(response => {
			if (context.getters.getTransactionHash === response.transactionInfo.hash) {
				Vue.prototype.$nuxt.$makeToast('success', `Your request has been processed.`);
				Vue.prototype.$nuxt.$makeToast('success', `View transaction in explorer.`, {
					noAutoHide: true,
					href: `${networkInfo.explorerUrl}transactions/${response.transactionInfo.hash}`,
				});

				context.commit('setTransactionHash', '');
				listener.close();
				context.dispatch('fetchFaucetBalance');
			}
		});
	},
};
