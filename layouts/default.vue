<template>
    <div id="app">
        <div class="bg-container">
            <img :src="ArtLeftSrc" class="bg-image bg-image-left" />
            <img :src="ArtRightSrc" class="bg-image bg-image-right" />
            <div class="bg-gradient" />
        </div>
        <div class="main-container-wrapper">
            <div class="main-container">
                <Header />
                <nuxt />
                <Footer />
            </div>
        </div>
        
    </div>
</template>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArtLeftSrc from '../assets/images/art-left.png';
import ArtRightSrc from '../assets/images/art-right.png';
export default {
    components: {
        Header,
        Footer,
    },
    data() {
        return {
            ArtLeftSrc,
            ArtRightSrc
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
    position: relative;
}

.bg-container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    background: url('../assets/images/bg.png');
    background-position: center;
    background-size: cover;
    position: fixed;
}

.main-container-wrapper {
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
    height: 100%;
    position: fixed;
    top: 0;
}

.bg-image-right {
    right: 0;
}

.bg-image-left {
    left: 0;
}

.bg-gradient {
    width: 100%;
    height: 37%;
    position: fixed;
    top: 0;
    right: 0;
    background: linear-gradient(180deg, #040022 0%, rgba(10, 6, 42, 0.692708) 46.35%, rgba(24, 21, 61, 0) 100%);
    z-index: 1;
}

@media #{$screen-tablet-sm}, #{$screen-mobile} {
    .bg-image {
        display: none;
    }
}
</style>
