import express from 'express';
import consola from 'consola';
const { Nuxt, Builder } = require('nuxt');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config({ path: '.env' });

// Import and Set Nuxt.js options
import config from '../nuxt.config';
config.dev = !(process.env.NODE_ENV === 'production');

import App, { IApp } from './app';
import { faucetHandler, claimsHandler } from './handlers';

async function start() {
    // Init Nuxt.js
    const nuxt = new Nuxt(config);
    const { host, port } = nuxt.options.server;

    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt);
        await builder.build();
    } else {
        await nuxt.ready();
    }

    // load node url from statistic service
    const nodes = await App.getNodeUrls({
        nodeFilter: 'suggested',
        limit: 30,
        ssl: true,
    });

    // Init App
    const appConfig: IApp = await App.init(nodes);

    app.get('/', faucetHandler(appConfig));
    app.post('/claims', claimsHandler(appConfig));

    // Give nuxt middleware to express
    app.use(nuxt.render);

    // Listen the server
    app.listen(port, host);
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true,
    });
}
start();
