<template>
<div class="faucetForm p-3">
    <b-col>
        <div class="formTitle">
            <span>Faucet</span>
        </div>
        <b-form @submit.prevent="claim">
            <div class="formInput">
            <div class="inputGroup">
                <span>Mosaic</span>
                <b-form-input id="input-small" size="sm" disabled v-model="form.mosaicName" required />
            </div>

            <div class="inputGroup">
                <span>Recipient</span>
                <b-form-input id="input-small" size="sm" :placeholder="recipientPlaceholder" v-model="form.recipient" required />
            </div>

            <div class="inputGroup">
                <span>Amount</span>
                <b-form-input id="input-small" size="sm" :placeholder="amountPlaceholder" v-model="form.amount" />
            </div>
        </div>

        <div class="formSubmit">
            <b-button type="submit">CLAIM!</b-button>
        </div>
        </b-form>
    </b-col>
</div>
</template>

<script>
export default {
    props: {
        mosaicFQN: { type: String, default: '' },
        recipientPlaceholder: { type: String, default: ''},
        amountPlaceholder: { type: String, default: ''}
    },
    data() {
      return {
        form: {
          mosaicName: this.mosaicFQN,
          recipient: '',
          amount: ''
        }
      }
    },
    methods: {
        claim() {
            this.$axios
            .$post('/claims', { ...this.form })
            .then(resp => {
                // this.txHashes.unshift(resp.txHash)
                this.$parent.makeToast('success', `Send your declaration.`)
                this.$parent.makeToast('success', `Amount: ${resp.amount} ${this.form.mosaicName}`)
                this.$parent.makeToast('success', `Transaction Hash: ${resp.txHash}`)
            })
            .catch(err => {
                const msg = (err.response.data && err.response.data.error) || err.response.statusTest
                this.$parent.makeToast('danger', `Message from server: ${msg}`)
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.form-control {
    font-size: inherit !important;
}

.formTitle {
    padding: 5px 0;

    span {
        font-size: 32px;
    }
}

.faucetForm {
    height: 120%;
    border-radius: 8px;
    opacity: 0.7;
    background: linear-gradient(120deg, #5200c6 0%, #44004e 100%);
    background-size: 100% auto;
    box-shadow: 0 1px 5px 1px #000a;
}

.formInput {
    .inputGroup {
        padding: 10px 0;
        font-size: 14px;

        input {
            opacity: 1;
        }
    }
}

.formSubmit {
    float: right;
    padding: 20px 0;
    margin: 5px;
    display: grid;
    width: 100%;
    padding-left: 30%;

    button {
        color: var(--primary);
        background-color: white;
        opacity: 1;
    }
}
</style>