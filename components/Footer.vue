<template>
    <div class="page-footer">
        <footer class="footer">
            <b-container fluid>
                <b-row class="footer-row mx-0 mx-md-4 mx-lg-4 px-lg-4">
                    <b-col sm="12" lg="12" class="footer-description">
                        <div class="ft-logo">
                            <a href="https://www.nem.io/" target="_blank">
                                <img src="~/assets/images/grit-logo.png" />
                            </a>
                            <p>Blockchain for the emerging digital economy</p>
                            <p>
                                Node: <a target="_blank" :href="defaultNode">{{ networkInfo.hostname }}</a>
                            </p>
                        </div>
                    </b-col>
                    <!-- <b-col sm="12" lg="12">
                        <ul class="social-icon">
                            <li v-for="link in links" :key="link.text" class="social-icon-item">
                                <a target="_blank" :href="link.href">
                                    <component :is="link.icon" />
                                    <span>{{ link.text }}</span>
                                </a>
                            </li>
                            <li class="social-icon-item">
                                <a target="_blank" :href="explorerUrl">
                                    <IconEarth />
                                    <span>Explorer</span>
                                </a>
                            </li>
                        </ul>
                    </b-col> -->
                </b-row>
            </b-container>
        </footer>
    </div>
</template>

<script>
import IconGithub from 'vue-material-design-icons/Github.vue';
import IconNewspaper from 'vue-material-design-icons/Newspaper.vue';
import IconReddit from 'vue-material-design-icons/Reddit.vue';
import IconForum from 'vue-material-design-icons/Forum.vue';
import IconTelegram from 'vue-material-design-icons/Telegram.vue';
import IconHomeCurrencyUsd from 'vue-material-design-icons/HomeCurrencyUsd.vue';
import IconEarth from 'vue-material-design-icons/Earth.vue';

export default {
    components: {
        IconGithub,
        IconNewspaper,
        IconReddit,
        IconForum,
        IconTelegram,
        IconHomeCurrencyUsd,
        IconEarth,
    },
    data() {
        return {
            links: [
                {
                    href: 'https://nemflash.io/',
                    text: 'NEM News',
                    icon: 'IconNewspaper',
                },
                {
                    href: 'https://forum.nem.io/',
                    text: 'Forum',
                    icon: 'IconForum',
                },
                {
                    href: 'https://t.me/nemred',
                    text: 'Telegram',
                    icon: 'IconTelegram',
                },
                {
                    href: 'https://www.reddit.com/r/nem/',
                    text: 'Reddit',
                    icon: 'IconReddit',
                },
                {
                    href: 'https://github.com/nemtech',
                    text: 'Github',
                    icon: 'IconGithub',
                },
            ],
        };
    },
    computed: {
        networkInfo() {
            return this.$store.getters.getNetworkInfo;
        },
        explorerUrl() {
            return this.networkInfo.explorerUrl;
        },
        defaultNode() {
            return this.networkInfo.defaultNode;
        },
    },
};
</script>

<style lang="scss" scoped>
.page-footer {
    width: 100%;
}

.footer {
    width: 100%;
    bottom: 0;

    .footer-row {
        padding-top: 40px;

        .ft-desc {
            p {
                font-size: 12px;
                text-align: justify;
                color: hsla(0, 0%, 100%, 0.66);
                font-weight: 200;
            }
        }

        .ft-logo {
            text-align: center;
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

        .footer-description {
            margin-top: -40px;
            text-align: center;
        }
    }
}

.social-icon {
    list-style: none;
    justify-content: flex-start;
    flex-wrap: wrap;
    display: flex;
    padding: 0;
    margin: 0 -15px;

    .social-icon-item {
        -webkit-box-flex: 1;
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

.endpoint-info {
    font-size: small;
    padding-top: 10%;

    a {
        color: #fff;
    }
}

.horisontal-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
