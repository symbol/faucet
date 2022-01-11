<template>
    <b-input v-model="model" class="text-box" :placeholder="placeholder" :type="type" :min="min" />
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Number],
        },
        placeholder: {
            type: [String, Number],
        },
        type: {
            type: [String],
        },
        min: {
            type: [Number],
        },
    },

    computed: {
        model: {
            get() {
                return this.value;
            },

            set(value) {
                this.$emit('input', value);
            },
        },
    },
};
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables.scss';

.text-box {
    min-width: 235px;
    height: auto;
    margin-bottom: $spacing-controls;
    padding: 11px 11px 12px;
    color: var(--color-darkmode-button-text);
    font: var(--font-web-large-body);
    text-decoration: none;
    background: var(--color-darkmode-button-bg);
    border: 2px solid var(--color-darkmode-form-accent-light);
    border-radius: 4px;
    box-shadow: var(--effect-button-default);
    cursor: pointer;
    transition: background-color 0.2s;
    user-select: none;

    &:hover {
        filter: drop-shadow(0 0 9px #ea00ff);
    }

    &:focus {
        box-shadow: 0px 0px 4px 4px rgba(255, 153, 153, 0.2);
    }

    &:last-child {
        margin-bottom: 0;
    }

    &::placeholder {
        text-align: center;
    }

    &[type=number] {
        -webkit-appearance: textfield;
        -moz-appearance: textfield;
        appearance: textfield;
    }
    &[type=number]::-webkit-inner-spin-button, 
    &[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none;
    }
}


@media #{$screen-tablet-lg}, #{$screen-tablet-sm} {
    .text-box {
        font: var(--font-web-desktop-body);
    }
}


@media #{$screen-mobile} {
    .text-box {
        font: var(--font-web-mobile-body);
    }
}
</style>
