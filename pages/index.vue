<template>
<b-container fluid="lg" style="max-width: 1200px">
  <b-row>
    <b-col cols="12" lg="6" >
      <div class="p-3">
        <b-col>
          <b-row>
        <b-img src="~/assets/images/symbol_logo_white.svg" fluid alt="Symbol" width=240></b-img>
      </b-row>
      <b-row>
        <div>
          <span class="subTitle">Claim mosaics for development and testing purposes on the symbol network</span>
        </div>
      </b-row>

      <b-col cols="12">
        <b-row>
        <FaucetForm class="d-lg-none d-xl-none d-md-block"
          :mosaicId="networkInfo.nativeCurrencyId"
          :filterMosaics="faucetAccount.filterMosaics"
          :recipientPlaceholder="`Address start with a capital T`"
          :amountPlaceholder="`(Faucet will pay up to ${networkInfo.nativeCurrencyMaxOut} XYM, or enter custom amount)`"
        />
      </b-row>
      </b-col>

      <b-row>
        <div class="info">
          <span>Please send back claimed mosaics when you no longer need it.</span>
          <span>Faucet Address:
            <span class="highlight">
              {{ faucetAccount.address }}
            </span>
          </span>
        </div>
      </b-row>
        </b-col>
      </div>
    </b-col>

    <b-col lg="6">
      <FaucetForm class="d-lg-block d-none"
      :mosaicId="networkInfo.nativeCurrencyId"
      :filterMosaics="faucetAccount.filterMosaics"
      :recipientPlaceholder="`Address start with a capital T`"
      :amountPlaceholder="`(Faucet will pay up to ${networkInfo.nativeCurrencyMaxOut} XYM, or enter custom amount)`"

      />
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { Address, AccountHttp, MosaicHttp, MosaicService, Listener, NamespaceHttp, RepositoryFactoryHttp } from 'symbol-sdk'
import { interval, combineLatest } from 'rxjs'
import { filter, mergeMap, concatMap, distinctUntilChanged, map } from 'rxjs/operators'

import FaucetForm from '@/components/FaucetForm.vue'

export default {
  components: {
    FaucetForm
  },
  asyncData({ res, store, error }) {
  // if (res.error) return error(res.error)
  // if (!res.data) return {}
  // const faucet = res.data.faucet
  // const firstChar = faucet.address[0]
  // const recipientPattern = `^${firstChar}[ABCD].+`
  // const recipientPlaceholder = `Address start with a capital ${firstChar}`
  // const amountPlaceholder = `(Up to ${faucet.outOpt}. Optional, if you want fixed amount)`
  // const data = {
  //   faucet,
  //   formAttribute: {
  //     recipientPattern,
  //     recipientPlaceholder,
  //     amountPlaceholder
  //   }
  // }
  // console.debug('asyncData: %o', res.data)
  // return data
},
  computed: {
    faucetAccount () {
      return this.$store.getters['getFaucetAccount']
    },
    networkInfo () {
      return this.$store.getters['getNetworkInfo']
    },
  },
data() {
  return {
    app: {
      waiting: false,
      listener: null,
      poller: null
    },
    faucet: {
      drained: false,
      network: null,
      apiUrl: null,
      publicUrl: null,
      mosaicFQN: null,
      mosaicId: null,
      outMax: null,
      outMin: null,
      outOpt: null,
      step: null,
      address: null,
      balance: null,
      blackListMosaics: [],
      mosaicList:[],
      filterMosaics: []
    },
    form: {
      recipient: null,
      message: null,
      amount: null,
      encryption: false
    },
    txHashes: []
  }
},
created() {
  if (process.browser) {
    // inject method into $nuxt, allow access from store
    this.$nuxt.$makeToast = this.makeToast
  }
},
beforeDestroy() {
  this.app.listener != null && this.app.listener.close()
  this.app.poller != null && this.app.poller.unsubscribe()
},
methods: {
  makeToast(variant = null, message) {
    this.$bvToast.toast(message, {
    title: `Notification`,
    variant: variant,
    solid: true,
    toaster: 'b-toaster-top-right',
    appendToast: true
    })
  }
}
}
</script>
<style lang="scss" scoped>
.container {
  margin-top: 20px;
}

.row {
  padding: 10px 0;
}

.subTitle {
    font-size: 18px;
    font-weight: bolder;
}

.info {
  span {
    display: block;
    padding: 5px 0;
    font-size: 14px;

    .highlight {
      display: inline;
      color: var(--secondary)
    }
  }
}
</style>