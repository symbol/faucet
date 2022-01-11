<template>
    <b-container class="footer mw-100">
        <b-row align-h="around">
            <div v-for="(link, index) in links" :key="'link' + index" class="link">
                <a :href="link.href" target="_blank" rel="noopener noreferrer">
                    <img :src="link.icon" :alt="link.text" class="link-icon"/>
                    <div class="link-text">
                        {{ link.text }}
                    </div>
                </a>
            </div>
        </b-row>
    </b-container>
</template>

<script>
import { Config } from '../config';
import IconExplorerSrc from '../assets/images/l-explorer.png';
import IconDiscordSrc from '../assets/images/l-discord.png';
import IconGithubSrc from '../assets/images/l-github.png';
import IconTwitterSrc from '../assets/images/l-twitter.png';

export default {
    data() {
        return {
            links: [
                {
                    href: Config.URL_EXPLORER,
                    text: 'Symbol Explorer',
                    icon: IconExplorerSrc,
                },
                {
                    href: Config.URL_DISCORD,
                    text: 'Discord',
                    icon: IconDiscordSrc,
                },
                {
                    href: Config.URL_GITHUB,
                    text: 'Github',
                    icon: IconGithubSrc,
                },
                {
                    href: Config.URL_TWITTER,
                    text: 'Twitter',
                    icon: IconTwitterSrc,
                },
            ],
        };
    }
};
</script>

<style lang="scss" scoped>
@import '../assets/stylesheets/variables.scss';

.link-icon {
    height: 56px;
}

.link-text {
    padding: 5px 0;
    max-width: 56px;
    font-family: Carbon;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 120%;
    color: var(--color-darkmode-text-body);
    opacity: 0.7;
    text-align: center;
    text-transform: uppercase;
}


@media #{$screen-tablet-lg}, #{$screen-tablet-sm} {
    .link-icon {
        height: 48px;
    }

    .link-text {
        max-width: 48px;
        font-size: 10px;
        line-height: 120%;
    }
}

@media #{$screen-mobile} {
    .link-icon {
        height: 48px;
    }

    .link-text {
        max-width: 48px;
        font-size: 10px;
        line-height: 120%;
    }
}

</style>
