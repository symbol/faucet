<template>
<div class="faucetForm">
    <b-col>
        <div class="formTitle">
            <h1>Faucet</h1>
        </div>

        <div class="formInput">
            <div class="inputGroup">
                <span>Mosaic</span>
                <b-input disabled="true" :value="mosaicFQN"></b-input>
            </div>

            <div class="inputGroup">
                <span>Recipient</span>
                <b-input :placeholder="recipientPlaceholder"></b-input>
            </div>

            <div class="inputGroup">
                <span>Amount</span>
                <b-input :placeholder="amountPlaceholder"></b-input>
            </div>

        </div>

        <div class="formSubmit">
            <span>Submit</span>
            <b-button>CLAIM!</b-button>
        </div>
    </b-col>
</div>
</template>

<script>
export default {
    props: {
        mosaicFQN: { type: String, default: '' },
        recipientPlaceholder: { type: String, default: ''},
        amountPlaceholder: { type: String, default: ''}
    }
}
</script>

<style lang="scss" scoped>
.faucetForm {
    background: rgba(82, 0, 198, 0.8);
    padding: 20px;
    border-radius: 16px;
    height: 120%;
}

.formInput {
    padding: 20px 0;
    margin: 5px;

    .inputGroup {
        padding: 10px 0;
    }
}

.formSubmit {
    float: right;
    padding: 20px 0;
    margin: 5px;
    display: grid;
    width: 100%;
    padding-left: 30%;

    button {
        color: var(--primary);
        background-color: white;
    }
}
</style>