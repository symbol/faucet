<template>
  <footer>
    <div class="footer symbolFooter">
      <div class="columns">
        <div class="column is-4">
          <div class="ft-logo">
            <a href="https://www.nem.io/" target="_blank">
              <img src="~/assets/images/logo_footer.png" >
            </a>
          </div>
          <div class="ft-desc">
            <p>
              Symbol is a platform built on revolutionary blockchain
              technology, reimagining from scratch the ideal
              blockchain.
              Symbol does not only allow for standard peer-to-peer
              value transfer transactions, but instead does much
              more – store data, make transactions, prove identity,
              timestamp documents, and create arbitrary digital
              assets.
            </p>
          </div>
        </div>
        <div class="column is-4 ft-link">
          <ul class="social-icon">
            <li v-for="link in links" :key="link.text" class="social-icon-item">
                <a target="_blank" :href="link.href">
                    <component :is="link.icon" />
                    <span>{{link.text}}</span>
                </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>


<script>
import IconGithub from 'vue-material-design-icons/Github.vue'
import IconNewspaper from 'vue-material-design-icons/Newspaper.vue'
import IconReddit from 'vue-material-design-icons/Reddit.vue'
import IconForum from 'vue-material-design-icons/Forum.vue'
import IconTelegram from 'vue-material-design-icons/Telegram.vue'
import IconHomeCurrencyUsd from 'vue-material-design-icons/HomeCurrencyUsd.vue'
import IconEarth from 'vue-material-design-icons/Earth.vue'

export default {
  components: {
    IconGithub,
    IconNewspaper,
    IconReddit,
    IconForum,
    IconTelegram,
    IconHomeCurrencyUsd,
    IconEarth
  },

  data() {
    return {
      links: [
			{
				"href": "https://nemflash.io/",
				"text": "NEM News",
				"icon": "IconNewspaper"
			},
			{
				"href": "https://forum.nem.io/",
				"text": "Forum",
				"icon": "IconForum"
			},
			{
				"href": "https://t.me/nemred",
				"text": "Telegram",
				"icon": "IconTelegram"
			},
			{
				"href": "https://www.reddit.com/r/nem/",
				"text": "Reddit",
				"icon": "IconReddit"
			},
			{
				"href": "https://github.com/nemtech",
				"text": "Github",
				"icon": "IconGithub"
			},
			{
				"href": "https://symboldev-faucet-01.herokuapp.com/",
				"text": "Faucet-01",
				"icon": "IconHomeCurrencyUsd"
			},
			{
				"href": "https://symboldev-faucet-02.herokuapp.com/",
				"text": "Faucet-02",
				"icon": "IconHomeCurrencyUsd"
      },
      {
        "href": "http://explorer.symboldev.network/",
				"text": "Explorer",
				"icon": "IconEarth"
      }
		]
    }
  },
}
</script>

<style lang="stylus" scoped>
.ft-link {
  padding : 0px 0px
}

.ft-logo {
  height: 30px;
  display: inline-block;

  a {
    text-decoration: none;
    background-color: transparent;

    img {
      width: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
}

.ft-desc {
  margin-top: 1rem!important;

  p {
    font-size: 12px;
    text-align: justify;
    color: hsla(0,0%,100%,.66);
    font-weight: 200;
  }
}

.social-icon {
  list-style: none;
  justify-content: space-between;
  flex-wrap: wrap;
  display: flex;
  padding: 30px 0;

  .social-icon-item {
      flex: auto;
      margin: 5px;

      a {
          color: #fff;
          text-decoration: none;

          span {
              margin-left: 5px;
          }

          i {
              font-size: 15px;
          }
      }
  }
}

.column.is-4{
  padding: 0 15px
}
</style>