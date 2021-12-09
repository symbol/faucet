<template>
    <button class="button" @click="onClick">
        <slot />
    </button>
</template>

<script>
export default {
    methods: {
        onClick() {
            this.$emit('click');
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables.scss';

.button {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    min-width: 235px;
    padding: 12px 32px 10px;
    color: var(--color-darkmode-button-text);
    font: var(--font-web-large-button-bounded);
    letter-spacing: var(--typography-web-large-button-bounded-letter-spacing);
    text-align: center;
    text-transform: var(--typography-web-large-button-bounded-text-case);
    text-decoration: none;
    background: var(--color-darkmode-button-bg);
    border: 2px solid var(--color-darkmode-button-text);
    border-radius: 4px;
    box-shadow: var(--effect-button-default);
    cursor: pointer;
    transition: background-color 0.2s;
    user-select: none;

    &:hover {
        background: var(--color-darkmode-button-bg-hover);
        box-shadow: var(--effect-button-hover);
    }

    &:last-child {
        margin-right: 0;
    }
}

@media #{$screen-tablet-lg}, #{$screen-tablet-sm} {
    .button {
        font: var(--font-web-desktop-button-bounded);
        letter-spacing: var(--typography-web-desktop-button-bounded-letter-spacing);
        text-transform: var(--typography-web-desktop-button-bounded-text-case);
    }
}

@media #{$screen-mobile} {
    .button {
        min-width: 128px;
        padding: 8.79px 14.65px 7.4px;
        font: var(--font-web-mobile-button-bounded);
        letter-spacing: var(--typography-web-mobile-button-bounded-letter-spacing);
        text-transform: var(--typography-web-mobile-button-bounded-text-case);
    }
}
</style>
