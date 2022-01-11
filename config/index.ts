import ConfigFile from './default.json';

export class Config {
    static URL_GITHUB = process.env.URL_GITHUB || ConfigFile.URL_GITHUB;
    static URL_TWITTER = process.env.URL_TWITTER || ConfigFile.URL_TWITTER;
    static URL_DISCORD = process.env.URL_DISCORD || ConfigFile.URL_DISCORD;
    static URL_EXPLORER = process.env.URL_EXPLORER || ConfigFile.URL_EXPLORER;
    static TELEGRAM_CH_HELPDESK = process.env.TELEGRAM_CH_HELPDESK || ConfigFile.TELEGRAM_CH_HELPDESK;
    static DISCORD_CH_HELPDESK = process.env.DISCORD_CH_HELPDESK || ConfigFile.DISCORD_CH_HELPDESK;
}
