<template>
    <div id="app">
        <div class="bg-container">
            <div class="bg-art-container" >
                <div class="position-relative" ref="bg">
                    <div v-if="showArt" class="bg-image bg-image-left" />
                </div>
                <div class="bg-art-middle" />
                <div class="position-relative">
                    <div v-if="showArt" class="bg-image bg-image-right" />
                </div>
            </div>
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
            ArtRightSrc,
            showArt: true,
            resizeObserver: null
        };
    },
    head() {
        return { title: 'Symbol Faucet' };
    },
    mounted() {
        const bg = this.$refs.bg;
        this.resizeObserver = new ResizeObserver((entries) => {
            const bgRect = entries[0].contentRect;
            const artShouldBeShown = bgRect.height / bgRect.width < 1.9;

            this.showArt = artShouldBeShown;
        });

        this.resizeObserver.observe(bg);
    },
    beforeDestroy() {
        this.resizeObserver.disconnect()
    } 
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
    width: 100vw;
    height: 100vh;
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
    max-width: 600px;
    padding: 80px 20px;
    margin: auto;
    position: relative;
}

.bg-art-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: grid;
    grid-template-columns: auto 900px auto;
}

.bg-art-middle {
    content: ' ';
}

.bg-image {
    width: 100%;
    height: 100%;
}

.bg-image-left {
    background: url('../assets/images/art-left.png');
    background-position: 100% 25%;
    background-size: cover;
}

.bg-image-right {
    background: url('../assets/images/art-right.png');
    background-position: 0% 25%;
    background-size: cover;
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

@media #{$screen-tablet-lg}, #{$screen-tablet-sm}, #{$screen-mobile} {
    .bg-art-container {
        grid-template-columns: auto 750px auto;
    }

    .main-container {
        max-width: 450px;
    }
}

@media #{$screen-tablet-sm}, #{$screen-mobile} {
    .bg-image {
        display: none;
    }
}
</style>
