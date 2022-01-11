<template>
    <div class="header">
        <img :src="LogoSrc" alt="Symbol Faucet Logo" class="logo" />
    </div>
</template>

<script>
import LogoSrc from '../assets/images/logo.svg';
export default {
    data() {
        return {
            LogoSrc,
        };
    },
};
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: center;
}

.logo {
    width: 280.86px;
    height: 151.58px;
}
</style>
