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
    width: 100%;
    min-width: 235px;
    padding: 12px 32px 10px;
    color: var(--color-darkmode-button-secondary-text);
    font: var(--font-web-large-button-medium);
    letter-spacing: var(--typography-web-large-button-medium-letter-spacing);
    text-align: center;
    text-transform: var(--typography-web-large-button-medium-text-case);
    text-decoration: none;
    background: var(--color-darkmode-button-secondary-bg);
    border: 2px solid var(--color-darkmode-button-secondary-stroke);
    border-radius: 4px;
    box-shadow: var(--effect-button-default);
    cursor: pointer;
    transition: background-color 0.2s;
    user-select: none;

    &:hover {
        background: var(--color-darkmode-button-hover-bg);
        color: var(--color-darkmode-button-hover-text);
        border: 2px solid var(--color-darkmode-button-hover-stroke);
        box-shadow: var(--effect-button-hover);
    }

    &:last-child {
        margin-right: 0;
    }
}

@media #{$screen-tablet-lg}, #{$screen-tablet-sm} {
    .button {
        font: var(--font-web-desktop-button-medium);
        letter-spacing: var(--typography-web-desktop-button-medium-letter-spacing);
        text-transform: var(--typography-web-desktop-button-medium-text-case);
    }
}

@media #{$screen-mobile} {
    .button {
        min-width: 128px;
        font: var(--font-web-mobile-button-medium);
        letter-spacing: var(--typography-web-mobile-button-medium-letter-spacing);
        text-transform: var(--typography-web-mobile-button-medium-text-case);
    }
}
</style>
