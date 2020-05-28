<template>
  <div>
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer'

export default {
  components: {
    Footer
  },
  head() {
    return { title: 'SYMBOL Faucet' }
  }
}
</script>
