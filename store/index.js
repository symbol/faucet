import axios from 'axios'
import { Listener, Address } from 'symbol-sdk'

export const state = () => ({
  listener: null,
  faucetAccount: {},
  networkInfo: {}
})

export const getters = {
  getListener: state => state.listener,
  getFaucetAccount: state => state.faucetAccount,
  getNetworkInfo: state => state.networkInfo
}

export const mutations = {
  setListener: (state, listener) => { state.listener = listener},
  setFaucetAccount: (state, faucetAccount) => { state.faucetAccount = faucetAccount},
  setNetworkInfo: (state, networkInfo) => { state.networkInfo = networkInfo},
}

export const actions = {
  nuxtServerInit: ({ commit }, { res }) => {
    commit('setFaucetAccount', res.data.faucet)
    commit('setNetworkInfo', res.data.networkInfo)
  },

  fetchFaucetBalance: (context) => {
    // get faucetBalance and update store
  },

  claimFaucet: (context, form) => {
    const recipientAddress = Address.createFromRawAddress(form.recipient)
    context.dispatch('openListenser', recipientAddress)

    axios.post('/claims', { ...form }).then(
      x => {
        console.log(x)

      }
    )
  },

  openListenser: async (context, recipient) => {
    const listener = new Listener(context.state.networkInfo.defaultNode.replace('http', 'ws'), WebSocket)
    await listener.open()

    listener.unconfirmedAdded(recipient).subscribe(
      x => {
        // looking for transaction hash
        console.debug({x})
        // this.makeToast('success', 'Your request had been unconfirmed status!')
        console.log('success', 'Your request had been unconfirmed status!')
      }
    )

    listener.confirmed(recipient).subscribe(
      x => {
        // looking for transaction hash
        console.debug({x})
        console.log('success', 'Your Request had been confirmed status!')
        listener.close()
      }
    )
  },

  closeListenser: (context) => {
    if(context.$state.listener !== null) {
      context.$state.listener.close()
    }
  }

}
