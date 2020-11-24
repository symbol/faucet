<template>
    <b-container style="max-width: 1200px">
        <div class="error-section">
            <div class="error-title">
                <span>OOPS!</span>
            </div>

            <div class="error-content">
                <span> {{ errorMessage }} </span>
            </div>
        </div>
    </b-container>
</template>

<script>
export default {
    props: {
        error: {
            type: Object,
            required: true,
        },
    },
    computed: {
        errorMessage() {
            return this.error.message || 'Application Error';
        },
    },
};
</script>

<style lang="scss" scoped>
.error-section {
    text-align: center;
    position: relative;
    top: 50%;

    .error-title {
        font-size: 100px;
    }

    .error-content {
        font-size: 20px;
    }
}
</style>
