<template>
    <div class="row-margin">
        <img :src="LogoSrc" class="logo" />
    </div>
</template>

<script>
import LogoSrc from '../assets/images/logo.png';
export default {
    data() {
        return {
            LogoSrc,
        };
    },
};
</script>

<style lang="scss" scoped>
.logo {
    width: 100%;
}
</style>
