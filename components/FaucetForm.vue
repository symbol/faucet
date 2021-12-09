<template>
    <div>
        <div v-if="!loading">
            <Loading />
        </div>
        <div v-if="loading">
            <div class="form">
                <TextBox v-model="form.recipient" :placeholder="recipientPlaceholder" required />
                <TextBox v-if="hasNativeMosaicAmount" v-model="form.amount" type="number" :min="0" :placeholder="amountPlaceholder" />
                <Button @click="claim_store"> CLAIM </Button>
            </div>
        </div>
    </div>
</template>

<script>
import Button from '@/components/Button.vue';
import Loading from '@/components/Loading.vue';
import TextBox from '@/components/TextBox.vue';
import { Address } from 'symbol-sdk';

export default {
    components: {
        Button,
        Loading,
        TextBox,
    },
    props: {
        address: { type: String, default: '' },
        mosaicId: { type: String, default: '' },
        mosaicTicker: { type: String, default: '' },
        recipientPlaceholder: { type: String, default: '' },
        amountPlaceholder: { type: String, default: '' },
        filterMosaics: { type: Array, default: () => [''] },
    },
    data() {
        return {
            mosaicSelectManager: [],
            form: {
                recipient: '',
                amount: '',
                selectedMosaics: [],
            },
        };
    },
    computed: {
        loading() {
            return this.filterMosaics.length > 0;
        },
        hasRemoveButton() {
            return this.mosaicSelectManager.length > 1;
        },
        hasAddButton() {
            return this.filterMosaics.length > this.mosaicSelectManager.length;
        },
        hasNativeMosaicAmount() {
            return this.mosaicSelectManager.find((mosaic) => mosaic.mosaicId === this.mosaicId);
        },
    },
    mounted() {
        this.updateForm();
    },
    created() {
        this.mosaicSelectManager.push({ mosaicId: this.mosaicId, mosaicOptions: this.filterMosaics });
    },
    methods: {
        claim_store() {
            // Format data
            this.form.recipient = this.form.recipient.replace(/\s|-/g, '').toUpperCase();
            this.form.selectedMosaics = this.mosaicSelectManager.map((mosaic) => mosaic.mosaicId);
            this.form.amount = Number(this.form.amount | 0);
            try {
                const sender = Address.createFromRawAddress(this.address);
                const recipient = Address.createFromRawAddress(this.form.recipient);
                if (recipient.networkType !== sender.networkType) {
                    this.$parent.makeToast('warning', `Incorrect network. Address must start with a capital ${this.address[0]}.`);
                } else {
                    this.$store.dispatch('claimFaucet', { ...this.form });
                }
            } catch (e) {
                this.$parent.makeToast('warning', `Incorrect address format.`);
            }
        },
        add_mosaic() {
            const selectedMosaics = this.mosaicSelectManager.map((selected) => selected.mosaicId);
            const mosaicOptions = this.filterMosaics.filter((mosaic) => !selectedMosaics.includes(mosaic.mosaicId));

            this.mosaicSelectManager.push({ mosaicId: mosaicOptions[0].mosaicId, mosaicOptions });
            this.updateMosaicSelectManager();
        },
        remove_mosaic() {
            this.mosaicSelectManager.pop();
            this.updateMosaicSelectManager();
        },
        onChange() {
            this.updateMosaicSelectManager();
        },
        updateMosaicSelectManager() {
            this.mosaicSelectManager = this.mosaicSelectManager.map((selector) => {
                const selectedMosaics = this.mosaicSelectManager
                    .map((selected) => selected.mosaicId)
                    .filter((mosaic) => mosaic !== selector.mosaicId);

                return {
                    ...selector,
                    mosaicOptions: this.filterMosaics.filter((option) => !selectedMosaics.includes(option.mosaicId)),
                };
            });
        },
        updateForm() {
            const { recipient, amount } = this.$route.query;

            this.form.recipient = recipient || '';
            this.form.amount = amount || '';
        },
    },
};
</script>

<style lang="scss" scoped>
.form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 32px;
    background: var(--color-darkmode-bg-navbar);
    border-radius: 12px;
}
.button {
    width: 100%;
}
</style>
