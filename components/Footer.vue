<template>
    <div></div>
</template>

<script>
export default {
    data() {
        return {
            links: [
                {
                    href: 'https://nem.io',
                    text: 'NEM',
                    icon: 'IconNewspaper',
                },
                {
                    href: 'https://github.com/symbol',
                    text: 'Github',
                    icon: 'IconGithub',
                },
                {
                    href: 'https://discord.com/invite/xymcity',
                    text: 'Join Discord',
                    icon: 'IconDiscord',
                },
            ],
        };
    },
    computed: {
        networkInfo() {
            return this.$store.getters.getNetworkInfo;
        },
        explorerUrl() {
            return this.networkInfo.explorerUrl;
        },
        defaultNode() {
            return this.networkInfo.defaultNode;
        },
    },
};
</script>

<style lang="scss" scoped></style>
