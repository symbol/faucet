<template>
    <div id="app">
        <nuxt />
        <Footer />
    </div>
</template>

<script>
import Footer from '@/components/Footer';

export default {
    components: {
        Footer,
    },
    head() {
        return { title: 'SYMBOL Faucet' };
    },
};
</script>

<style lang="scss" scoped>
html,
body,
#fullheight {
    min-width: 100% !important;
    width: 100%;
}

#app {
    height: 100vh;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
}
</style>
