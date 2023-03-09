<template>
    <Loading v-if="loading" class="mt-5 pt-5"/>
    <div v-else class="page-container">
        <div class="row-margin text-center d-none d-md-block">
            <a target="_blank" :href="faucetAccountExplorerUrl" class="lighter">
                {{ faucetAddress }}
            </a>
        </div>

        <div class="row-margin text-center">
            <p class="hero">
                Thirsty? Take a drink.<br>
                This faucet is running on the Symbol testnet and dispenses up to 10,000 XYM per account.
            </p>
        </div>
        <div class="row-margin">
            <FaucetForm />
        </div>
        <div class="row-margin lighter text-center">
            <p>Done with your XYM? Send it back to the faucet. Remember, sharing is caring!</p>
            <p>
                If you’re looking to set up a voting node on Symbol (minimum 3,000,000 XYM), please send a request to 
                <a target="_blank" :href="telegramChHelpdeskURL">{{ telegramChHelpdesk }}</a> on Telegram, or {{ discordChHelpdesk }} on Discord.
            </p>
            <p class="d-block d-md-none">
                Faucet Address:
                <a target="_blank" :href="faucetAccountExplorerUrl">
                    {{ faucetAddress }}
                </a>
            </p>
        </div>
    </div>
</template>

<script>
import { Config } from '../config';
import FaucetForm from '@/components/FaucetForm.vue';
import Loading from '@/components/Loading.vue';

export default {
    components: { FaucetForm, Loading },

    computed: {
        loading() {
            return !(this.networkInfo && this.faucetAddress)
        },
        networkInfo() {
            return this.$store.getters.getNetworkInfo;
        },
        faucetAddress() {
            return this.networkInfo.address;
        },
        faucetAccountExplorerUrl() {
            const explorerURL = this.networkInfo.explorerUrl;
            const faucetAddress = this.faucetAddress;

            return `${explorerURL}accounts/${faucetAddress}`;
        },
        telegramChHelpdeskURL() {
            return `https://t.me/${this.telegramChHelpdesk.replace('@', '')}`;
        },
        telegramChHelpdesk() {
            return Config.TELEGRAM_CH_HELPDESK
        },
        discordChHelpdesk() {
            return Config.DISCORD_CH_HELPDESK;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables.scss';

.lighter {
    opacity: 0.7;
    font-weight: lighter;
    filter: drop-shadow(0px 0px 10px #040022);
}

@media #{$screen-mobile} {
    .page-container {
        padding-top: $spacing-base-mobile;
    }
}
</style>
