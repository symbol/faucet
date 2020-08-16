<template>
<div class="faucetForm p-3">
    <div v-if="!loading">
        <Loading />
    </div>
    <b-col>
        <div class="formTitle">
            <span>Faucet</span>
        </div>

         <div v-if="loading">
             <b-form @submit.prevent="claim_store">
                <div class="formInput">

                <div class="inputGroup">
                    <span>Mosaic</span>
                    <div class="mosaicGroup">
                        <div v-for="(list,index) in mosaicSelectManager" :key="'option_'+index">
                            <b-form-select v-model="list.mosaicId" size="sm" required @change="onChange" >
                                <b-form-select-option v-for="(mosaic,index) in list.mosaicOptions" :value="mosaic.mosaicId" :key="'option_'+index">
                                    {{mosaic.mosaicAliasName}} - Balance: {{mosaic.amount}}
                                </b-form-select-option>
                            </b-form-select>
                        </div>
                    </div>

                    <div class="mosaicControlPanel">
                        <a v-if="hasAddButton" @click="add_mosaic">Add Mosaic</a>
                        <a v-if="hasRemoveButton" @click="remove_mosaic">Remove Mosaic</a>
                    </div>
                </div>

                <div class="inputGroup">
                    <span>Recipient</span>
                    <b-form-input id="input-small" size="sm" :placeholder="recipientPlaceholder" v-model="form.recipient" required />
                </div>

                <div v-if="hasNativeMosaicAmount" class="inputGroup">
                    <span>XYM Amount</span>
                    <b-form-input type="number" id="input-small" size="sm" :placeholder="amountPlaceholder" v-model="form.amount" />
                </div>
            </div>

            <div class="formSubmit">
                <b-button type="submit">CLAIM!</b-button>
            </div>
            </b-form>
        </div>
    </b-col>
</div>
</template>

<script>
import Loading from '@/components/Loading.vue'

export default {
    components: {
        Loading
    },
    computed: {
        loading() {
            return this.filterMosaics.length > 0
        },
        hasRemoveButton() {
            return this.mosaicSelectManager.length > 1
        },
        hasAddButton() {
            return this.filterMosaics.length > this.mosaicSelectManager.length
        },
        hasNativeMosaicAmount() {
            return this.mosaicSelectManager.find(mosaic => mosaic.mosaicId === this.mosaicId)
        }
    },
    props: {
        mosaicId: { type: String, default: '' },
        recipientPlaceholder: { type: String, default: ''},
        amountPlaceholder: { type: String, default: ''},
        filterMosaics: {type: Array, default: []}
    },
    mounted() {
        this.updateForm()
    },
    data() {
        return {
            mosaicSelectManager: [],
            form: {
                recipient: '',
                amount: '',
                selectedMosaics: []
            }
        }
    },
    updated(){
        if (!this.mosaicSelectManager.length) {
            this.mosaicSelectManager.push({mosaicId: this.mosaicId ,mosaicOptions:this.filterMosaics})
        }
    },
    methods: {
        claim_store() {
            // Format data
            this.form.recipient = this.form.recipient.replace(/\s|-/g, '')
            this.form.selectedMosaics = this.mosaicSelectManager.map(mosaic => mosaic.mosaicId)
            this.form.amount = Number(this.form.amount | 0)

            if (this.form.recipient.length !== 39 || this.form.recipient.charAt(0) !== 'T') {
                this.$parent.makeToast('warning', `Address format incorrect.`)
            } else {
                this.$store.dispatch("claimFaucet", { ...this.form })
            }
        },
        add_mosaic() {
            const selectedMosaics = this.mosaicSelectManager.map(selected => selected.mosaicId)
            const mosaicOptions = this.filterMosaics.filter(mosaic => selectedMosaics.indexOf(mosaic.mosaicId) === -1)

            this.mosaicSelectManager.push({mosaicId: mosaicOptions[0].mosaicId, mosaicOptions})
            this.updateMosaicSelectManager()
        },
        remove_mosaic() {
            this.mosaicSelectManager.pop()
            this.updateMosaicSelectManager()
        },
        onChange() {
            this.updateMosaicSelectManager()
        },
        updateMosaicSelectManager() {
            this.mosaicSelectManager = this.mosaicSelectManager.map(selector => {
                const selectedMosaics = this.mosaicSelectManager.map(selected => selected.mosaicId).filter(mosaic => mosaic !== selector.mosaicId)
                return {
                    ...selector,
                    mosaicOptions: this.filterMosaics.filter(option => selectedMosaics.indexOf(option.mosaicId) === -1)
                }
            })
        },
        updateForm() {
            const { recipient, amount } = this.$route.query
            this.form.recipient = recipient || ''
            this.form.amount = amount || ''
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
    margin-top: 15px;
}

.formInput {
    .inputGroup {
        padding: 10px 0;
        font-size: 14px;

        input {
            opacity: 1;
        }
    }

    .mosaicGroup {
        select {
            margin-bottom: 5px;
        }
    }

    .mosaicControlPanel{
        float: right;
        a {
            padding: 0 15px;
            cursor: pointer;
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