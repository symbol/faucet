<template>
    <b-container fluid="lg" style="max-width: 1200px">
        <b-row>
            <b-col cols="12" lg="12">
                <div class="p-3">
                    <b-col class="upper-section">
                        <div>
                            <b-img class="logo-image" src="~/assets/images/grit-logo.png" fluid alt="Grit Logo" width="240" />
                        </div>
                        <div>
                            <div class="subtitle-container">
                                <p class="subTitle">Claim mosaics for development and testing purposes on the Grit Network</p>
                            </div>
                        </div>

                        <divw>
                            <FaucetForm
                                class="d-lg-none d-xl-none d-md-block mx-form"
                                :mosaic-id="networkInfo.nativeCurrencyId"
                                :filter-mosaics="filterMosaics"
                                :recipient-placeholder="recipientPlaceholder"
                                :amount-placeholder="amountPlaceholder"
                            />
                        </divw>

                        <div>
                            <div class="info">
                                <span>Please send back claimed mosaics when you no longer need them.</span>
                                <!-- <span
                                    >If anyone wants to claim 3m GRIT to allow setting up a voting node/supernode, please request from the
                                    <a target="_blank" href="https://t.me/nemhelpdesk">@nemhelpdesk</a> telegram channel
                                </span> -->
                                <span>
                                    Faucet Address:

                                    <span class="highlight">
                                        <a target="_blank" :href="faucetAccountUrl">
                                            {{ networkInfo.address }}
                                        </a>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </b-col>
                </div>
            </b-col>

            <b-col lg="8" class="faucet-container">
                <FaucetForm
                    class="d-lg-block d-none"
                    :mosaic-id="networkInfo.nativeCurrencyId"
                    :filter-mosaics="filterMosaics"
                    :recipient-placeholder="recipientPlaceholder"
                    :amount-placeholder="amountPlaceholder"
                />
            </b-col>
        </b-row>
    </b-container>
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
            return `Address start with a capital ${this.networkInfo.address[0]}`;
        },
        amountPlaceholder() {
            return `(Faucet will pay up to ${this.networkInfo.nativeCurrencyMaxOut} GRIT, or enter custom amount)`;
        },
        faucetAccountUrl() {
            return `${this.networkInfo.explorerUrl}accounts/${Address.createFromRawAddress(this.networkInfo.address).plain()}`;
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
.container {
    margin-top: 20px;
}

.row {
    padding: 10px 0;
}

.subTitle {
    font-size: 18px;
    font-weight: bolder;
    text-align: center;
}

.upper-section {
    text-align: center;
}

.mx-form {
    margin: 0 -0.7rem !important;
    padding: 0 0.7rem !important;
}

.info {
    span {
        display: block;
        padding: 5px 0;
        font-size: 14px;

        .highlight {
            display: inline;
            color: var(--secondary);
        }
    }
}

.faucet-container {
    margin: 0 auto;
}

.subtitle-container {
    text-align: center;
}

.logo-image {
    margin: 0 auto;
}
</style>
