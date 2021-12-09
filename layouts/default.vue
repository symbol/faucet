<template>
    <div id="app">
        <img :src="MMSrc" class="bg-image" />
        <div class="main-container">
            <Header />
            <nuxt />
            <Footer />
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MMSrc from '../assets/images/mm.png';
export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            MMSrc,
        };
    },
    head() {
        return { title: 'Symbol Faucet' };
    },
};
</script>

<style lang="scss">
@import '../assets/stylesheets/variables.scss';

html,
body,
#__nuxt,
#__layout,
#app {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}

#app {
    background: url('../assets/images/bg-space.png');
    background-position: center;
    background-size: cover;
    overflow-y: auto;
    position: relative;
}

.main-container {
    width: 100%;
    max-width: 450px;
    padding: 80px 20px;
    margin: auto;
    position: relative;
}

.bg-image {
    width: 25%;
    position: fixed;
    bottom: 16%;
    right: 8%;
}

@media #{$screen-tablet-sm}, #{$screen-mobile} {
    .bg-image {
        display: none;
    }
}
</style>
