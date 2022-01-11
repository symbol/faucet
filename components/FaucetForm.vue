<template>
    <div class="form">
        <TextBox v-model="form.recipient" :placeholder="recipientPlaceholder" required />
        <TextBox v-model="form.amount" type="number" :min="0" :placeholder="amountPlaceholder" />
        <Button @click="claim"> CLAIM </Button>
    </div>
</template>

<script>
import { Address } from 'symbol-sdk';
import Button from '@/components/Button.vue';
import TextBox from '@/components/TextBox.vue';

export default {
    components: { Button, TextBox },

    data() {
        return {
            form: {
                recipient: '',
                amount: 0
            },
        };
    },

    computed: {
        networkInfo() {
            return this.$store.getters.getNetworkInfo;
        },
        recipientPlaceholder() {
            return `Your Testnet Address (Starts with ${this.faucetAddress[0]})`;
        },
        amountPlaceholder() {
            return `${this.mosaicTicker} Amount (Max 10,000)`;
        },
        mosaicTicker() {
            return this.networkInfo.nativeCurrencyName?.split('.').pop().toUpperCase() || 'XYM';
        },
        mosaicId() {
            return this.networkInfo.nativeCurrencyId;
        },
        faucetAddress() {
            return this.networkInfo.address;
        }
    },

    created() {
        if (process.browser) {
            // inject method into $nuxt, allow access from store
            this.$nuxt.$makeToast = this.makeToast;
        }
    },

    mounted() {
        this.updateForm();
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
        claim() {
            this.form.recipient = this.form.recipient.replace(/\s|-/g, '').toUpperCase();
            this.form.selectedMosaics = [this.mosaicId];
            this.form.amount = Number(this.form.amount | 0);

            try {
                const sender = Address.createFromRawAddress(this.faucetAddress);
                const recipient = Address.createFromRawAddress(this.form.recipient);
                if (recipient.networkType !== sender.networkType) {
                    this.makeToast('warning', `Incorrect network. Address must start with ${this.faucetAddress[0]}.`);
                } else {
                    this.$store.dispatch('claimFaucet', { ...this.form });
                }
            } catch (e) {
                this.makeToast('warning', `Incorrect address format.`);
            }
        },
        updateForm() {
            const { recipient, amount } = this.$route.query;

            this.form.recipient = recipient || '';
            this.form.amount = amount || '';
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables.scss';

.form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: $spacing-card;
    background: var(--color-darkmode-bg-navbar);
    border-radius: 12px;
}

@media #{$screen-mobile} {
    .form {
        padding: $spacing-card-mobile;
    }
}
</style>
