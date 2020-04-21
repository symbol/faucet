<template>
<b-container>
  <b-row >
    <b-col col-12 col-lg-6 >
      <b-row>
        <b-img src="~/assets/images/symbol_logo_white.svg" fluid alt="Symbol" width=200></b-img>
      </b-row>
      <b-row>
        <div class="subTitle">
          <span>Claim mosaics for development and testing purposes on the symbol network</span>
        </div>
      </b-row>
      <!-- <b-row>
        <b-col col-lg-6 d-none d-lg-block >
          <FaucetForm/>
        </b-col>
      </b-row> -->
      <b-row>
        <span>Please send back claimed mosaics when you no longer need it.</span>
        <span>Faucet Address: XXXXX</span>
        <span>Faucet Balance: 123.23 XYM</span>
      </b-row>
    </b-col>

    <b-col col-lg-6 d-none d-lg-block >
      <FaucetForm/>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import FaucetForm from '@/components/FaucetForm.vue'

export default {
  components: {
    FaucetForm,
  },
}
</script>
<style lang="scss" scoped>
.container {
  margin-top: 50px;
}
.subTitle {
  span {
      font-size: 19px;
      font-weight: bolder;
  }
}
</style>