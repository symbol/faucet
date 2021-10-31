<template>
    <div class="page-footer">
        <footer class="footer">
            <b-container fluid>
                <b-row class="footer-row mx-0 mx-md-4 mx-lg-4 px-lg-4">
                    <b-col sm="12" lg="4" class="footer-description">
                        <div class="ft-logo">
                            <a href="https://www.nem.io/" target="_blank">
                                <img src="~/assets/images/logo_footer.png" />
                            </a>
                        </div>
                        <div class="ft-desc mt-3">
                            <p>
                                Symbol is a platform built on revolutionary blockchain technology, reimagining from scratch the ideal
                                blockchain. Symbol does not only allow for standard peer-to-peer value transfer transactions, but instead
                                does much more – store data, make transactions, prove identity, timestamp documents, and create arbitrary
                                digital assets.
                            </p>
                        </div>
                    </b-col>
                    <b-col sm="12" lg="4">
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
                    </b-col>

                    <b-col sm="12" lg="4">
                        <span class="endpoint-info">
                            Node: <a target="_blank" :href="defaultNode">{{ networkInfo.hostname }}</a>
                        </span>
                    </b-col>
                </b-row>
            </b-container>
        </footer>
    </div>
</template>

<script>
import IconGithub from 'vue-material-design-icons/Github.vue';
import IconNewspaper from 'vue-material-design-icons/Newspaper.vue';
import IconEarth from 'vue-material-design-icons/Earth.vue';
import IconDiscord from 'vue-material-design-icons/Discord.vue';

export default {
    components: {
        IconGithub,
        IconNewspaper,
        IconDiscord,
        IconEarth,
    },
    data() {
        return {
            links: [
                {
                    href: 'https://nem.io',
                    text: 'NEM',
                    icon: 'IconNewspaper',
                },
                {
                    href: 'https://github.com/symbol',
                    text: 'Github',
                    icon: 'IconGithub',
                },
                {
                    href: 'https://discord.com/invite/xymcity',
                    text: 'Join Discord',
                    icon: 'IconDiscord',
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
