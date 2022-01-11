<template>
    <div>
        <div class="row-margin">
            <p class="hero">Claim mosaics for development and testing purposes on the symbol network</p>
        </div>
        <div class="row-margin">
            <FaucetForm />
        </div>
        <div class="row-margin lighter">
            <p>Done with your XYM? Send it back to the faucet. Remember, sharing is caring!</p>
            <p>
                If you’re looking to set up a voting node on Symbol (minimum 3,000,000 XYM), please send a request to 
                <a target="_blank" :href="telegramChHelpdeskURL">{{ telegramChHelpdesk }}</a> on Telegram, or {{ discordChHelpdesk }} on Discord.
            </p>
            <p>
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

export default {
    components: { FaucetForm },

    computed: {
        faucetAddress() {
            return this.$store.getters.getNetworkInfo.address;
        },
        faucetAccountExplorerUrl() {
            const explorerURL = this.$store.getters.getNetworkInfo.explorerUrl;
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
.lighter {
    opacity: 0.7;
    font-weight: lighter;
    filter: drop-shadow(0px 0px 10px #040022);
}
</style>
