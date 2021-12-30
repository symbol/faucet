<template>
    <div class="header row-margin">
        <img :src="LogoSrc" class="logo" />
    </div>
</template>

<script>
import LogoSrc from '../assets/images/logo-2.png';
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
    width: 188px;
}
</style>
