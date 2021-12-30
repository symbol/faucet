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
    margin-right: $margin-base;
    margin-bottom: $margin-base;
    padding: 10px 11px 11px;
    color: var(--color-darkmode-button-text);
    text-decoration: none;
    background: var(--color-darkmode-button-bg);
    border: 1px solid #b429fa;
    border-radius: 4px;
    box-shadow: var(--effect-button-default);
    cursor: pointer;
    transition: background-color 0.2s;
    user-select: none;

    &:hover {
        box-shadow: 0px 0px 0px 4px rgba(255, 153, 153, 0.2);
    }

    &:focus {
        box-shadow: 0px 0px 0px 4px rgba(255, 153, 153, 0.2);
    }

    &:last-child {
        margin-right: 0;
    }

    &[type="number"] {
        -webkit-appearance: textfield;
        -moz-appearance: textfield;
        appearance: textfield;
    }
    &[type=number]::-webkit-inner-spin-button, 
    &[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none;
    }
}

@media #{$screen-mobile} {
    .text-box {
        min-width: 128px;
        padding: 8.79px 14.65px 7.4px;
    }
}
</style>
