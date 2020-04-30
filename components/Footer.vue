<template>
<div class="page-footer">
  <footer class="footer">
      <b-container fluid>
          <b-row class="footer-row mx-0 mx-md-4 mx-lg-4 px-lg-4">
              <b-col sm="12" lg="4">
                  <div class="ft-logo">
                      <a href="https://www.nem.io/" target="_blank">
                      <img src="~/assets/images/logo_footer.png" >
                      </a>
                  </div>
                  <div class="footer-description mt-3" >
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
              </b-col>
              <b-col sm="12" lg="4" class="vertical-center">
                  <ul class="social-icon">
                      <li v-for="link in links" :key="link.text" class="social-icon-item">
                          <a target="_blank" :href="link.href">
                              <component :is="link.icon" />
                              <span>{{link.text}}</span>
                          </a>
                      </li>
                  </ul>
              </b-col>

              <b-col sm="12" lg="4" class="vertical-center">
                <span class="endpoint-info">
                  Node: {{endpointURL}}
                </span>
              </b-col>

          </b-row>
      </b-container>
  </footer>
</div>

</template>


<script>
import IconGithub from 'vue-material-design-icons/GithubCircle.vue'
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
    ],
    endpointURL: "api-01.ap-northeast-1.0941-v1.symboldev.network"
    }
  },
}
</script>

<style lang="scss" scoped>
.page-footer {
    width: 100%;
}

.footer {
    width: 100%;
    position: fixed;
    bottom: 0;

    .footer-row {
        padding-top: 40px;

        .footer-description {
          p {
              font-size: 12px;
              text-align: justify;
              color: hsla(0,0%,100%,.66);
              font-weight: 200;
          }
        }

        .ft-logo {
          a {
            height: 30px;
            display: inline-block;

            img {
                width: auto;
                max-width: 100%;
                max-height: 100%;
            }
          }
        }
    }
}

.social-icon {
  list-style: none;
  justify-content: space-between;
  flex-wrap: wrap;
  display: flex;
  padding: 0;

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

.vertical-center {
    margin-top: 5px;
    display: flex;
    justify-content: center;

    .endpoint-info {
      font-size: small;
      padding-top: 10%;
    }
}

.horisontal-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>