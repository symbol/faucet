<template>
    <div>
        <div class="row-margin">
            <p class="hero">Claim mosaics for development and testing purposes on the symbol network</p>
        </div>
        <div class="row-margin">
            <FaucetForm
                :address="networkInfo.address"
                :mosaic-id="networkInfo.nativeCurrencyId"
                :mosaic-ticker="mosaicTicker"
                :filter-mosaics="filterMosaics"
                :recipient-placeholder="recipientPlaceholder"
                :amount-placeholder="amountPlaceholder"
            />
        </div>
        <div class="row-margin lighter">
            <p>Please send back claimed mosaics when you no longer need them.</p>
            <p v-if="mosaicTicker === 'XYM'">
                If anyone wants to claim 3m {{ mosaicTicker }} to allow setting up a voting node/supernode, please request from the
                <a target="_blank" href="https://t.me/nemhelpdesk">@nemhelpdesk</a> telegram channel
            </p>
            <p>
                Faucet Address:
                <a target="_blank" :href="faucetAccountUrl">
                    {{ networkInfo.address }}
                </a>
            </p>
        </div>
    </div>
</template>

<script>
import { Address } from 'symbol-sdk';
import FaucetForm from '@/components/FaucetForm.vue';

export default {
    components: {
        FaucetForm,
    },
    computed: {
        filterMosaics() {
            return this.$store.getters.getFilterMosaics;
        },
        networkInfo() {
            return this.$store.getters.getNetworkInfo;
        },
        recipientPlaceholder() {
            return `Recipient (Address starts with a capital ${this.networkInfo.address[0]})`;
        },
        amountPlaceholder() {
            return `${this.mosaicTicker} Amount`;
        },
        faucetAccountUrl() {
            return `${this.networkInfo.explorerUrl}accounts/${Address.createFromRawAddress(this.networkInfo.address).plain()}`;
        },

        mosaicTicker() {
            return this.networkInfo.nativeCurrencyName?.split('.').pop().toUpperCase() || 'XYM';
        },
    },
    created() {
        if (process.browser) {
            // inject method into $nuxt, allow access from store
            this.$nuxt.$makeToast = this.makeToast;
        }
    },
    methods: {
        makeToast(variant = null, message, config) {
            this.$bvToast.toast(message, {
                title: `Notification`,
                variant,
                solid: true,
                toaster: 'b-toaster-top-right',
                appendToast: true,
                ...config,
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.lighter {
    opacity: 0.7;
    font-weight: lighter;
}
</style>
