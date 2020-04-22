<template>
<b-container>
  <b-row >
    <b-col cols="12" lg="6" >
      <b-row>
        <b-img src="~/assets/images/symbol_logo_white.svg" fluid alt="Symbol" width=200></b-img>
      </b-row>
      <b-row>
        <div class="subTitle">
          <span>Claim mosaics for development and testing purposes on the symbol network</span>
        </div>
      </b-row>

      <b-row>
        <FaucetForm class="d-lg-none d-xl-none d-md-block"
      :mosaicFQN="faucet.mosaicFQN"
      :recipientPlaceholder="formAttribute.recipientPlaceholder"
      :amountPlaceholder="formAttribute.amountPlaceholder"
      />
      </b-row>

      <b-row>
        <div class="subTitle">
          <span>Please send back claimed mosaics when you no longer need it.</span>
        </div>
        <div class="info">
          <span>Faucet Address:
            <span class="highlight">
              {{ faucet.address }}
            </span>
          </span>
          <span>Faucet Balance: {{ faucet.balance }} ({{faucet.mosaicFQN}}) </span>
        </div>

      </b-row>
    </b-col>

    <b-col lg="6">
      <FaucetForm class="d-lg-block d-none"
      :mosaicFQN="faucet.mosaicFQN"
      :recipientPlaceholder="formAttribute.recipientPlaceholder"
      :amountPlaceholder="formAttribute.amountPlaceholder"
      />
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { Address, AccountHttp, MosaicHttp, MosaicService, Listener } from 'symbol-sdk'
import { interval } from 'rxjs'
import { filter, mergeMap, concatMap, distinctUntilChanged } from 'rxjs/operators'

import FaucetForm from '@/components/FaucetForm.vue'

export default {
  components: {
    FaucetForm
  },
  asyncData({ res, store, error }) {
  if (res.error) return error(res.error)
  if (!res.data) return {}
  const faucet = res.data.faucet
  const firstChar = faucet.address[0]
  const recipientPattern = `^${firstChar}[ABCD].+`
  const recipientPlaceholder = `${faucet.network} address start with a capital ${firstChar}`
  const amountPlaceholder = `(Up to ${faucet.outOpt}. Optional, if you want fixed amount)`
  const data = {
    faucet,
    formAttribute: {
      recipientPattern,
      recipientPlaceholder,
      amountPlaceholder
    }
  }
  console.debug('asyncData: %o', data)
  return data
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
      balance: null
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
  // if (process.browser) {
  //   const { recipient, amount, message, encryption } = this.$nuxt.$route.query
  //   this.form = {
  //     ...this.form,
  //     recipient,
  //     amount,
  //     message,
  //     encryption: encryption && encryption.toLowerCase() === 'true'
  //   }
  // }
},
async mounted() {
  const faucetAddress = Address.createFromRawAddress(this.faucet.address)
  this.app.listener = new Listener(this.faucet.publicUrl.replace('http', 'ws'), WebSocket)
  this.app.listener.open().then(() => {
    this.app.listener.unconfirmedAdded(faucetAddress).subscribe(_ => {
      this.makeToast('success', 'Your request had been unconfirmed status!')
    })
    this.app.listener.confirmed(faucetAddress).subscribe(_ => {
      this.makeToast('success', 'Your Request had been confirmed status!')
    })
  })

  this.app.poller = this.accountPolling(faucetAddress)
  this.app.poller.subscribe(mosaicAmountView => (this.faucet.balance = mosaicAmountView.relativeAmount()))

  if (this.$recaptcha) {
    await this.$recaptcha.init()
  }
},
beforeDestroy() {
  this.app.listener != null && this.app.listener.close()
  this.app.poller != null && this.app.poller.unsubscribe()
},
methods: {
  accountPolling(address) {
    const accountHttp = new AccountHttp(this.faucet.publicUrl)
    const mosaicHttp = new MosaicHttp(this.faucet.publicUrl)
    const mosaicService = new MosaicService(accountHttp, mosaicHttp)
    return interval(5000).pipe(
      concatMap(() => mosaicService.mosaicsAmountViewFromAddress(address)),
      mergeMap(_ => _),
      filter(_ => _.mosaicInfo.id.toHex() === this.faucet.mosaicId),
      distinctUntilChanged((prev, current) => prev.relativeAmount() === current.relativeAmount())
    )
  },
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
  padding: 20px 0;
  margin: 5px;
}
.subTitle {
  span {
      font-size: 19px;
      font-weight: bolder;
  }
}

.info {
  span {
    display: block;
    font-size: 12px;

    .highlight {
      display: inline;
      color: var(--primary)
    }
  }
}
</style>