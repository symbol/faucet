# :potable_water: Symbol Faucet


## :handshake: Using with catapult-service-bootstrap

### Build or Pull image

```console
# build image
$ docker build -t symbol-faucet .

# or pull from dockerhub
$ docker pull symbolplatform/symbol-faucet:0.4.0
```

### Add as service

#### (Quickest way) Using nemesis Private Key example

```yaml:docker-compose.yml
faucet:
  # image: my-symbol-faucet # in case of built image
  image: symbolplatform/symbol-faucet:0.4.0
  stop_signal: SIGINT
  command: sh -c "/bin/sleep 15 && /bin/sh /app/bin/create-env.sh && /usr/local/bin/npm start"
  environment:
    - DEFAULT_NODE=http://rest-gateway:3000
  volumes:
    # for reading private key from addresses.yaml
    - ../../build/generated-addresses:/addresses:ro
    # for reading generation hash from block file
    - ../../data/api-node-0/00000:/data/00000:ro
  ports:
    - '4000:4000'
  depends_on:
    - rest-gateway
    - api-node-0
```

#### Using specific PrivateKey and GenerationHash

```yaml:docker-compose.yml
faucet:
  image: symbolplatform/symbol-faucet:0.4.0
  stop_signal: SIGINT
  environment:
    - DEFAULT_NODE=http://rest-gateway:3000
    - FAUCET_PRIVATE_KEY=__YOUR_PRIVATE_KEY__
  ports:
    - '4000:4000'
  depends_on:
    - rest-gateway
```

#### Specific Mosaic faucet example

```yaml:docker-compose.yml
faucet:
  image: symbolplatform/symbol-faucet:0.4.0
  stop_signal: SIGINT
  environment:
    - DEFAULT_NODE=http://rest-gateway:3000
    - NATIVE_CURRENCY_ID=3E70742C9A38ACAB
  ports:
    - '4000:4000'
  depends_on:
    - rest-gateway
```

## :sparkles: Deploy to Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Need to set `NEM_PRIVATE_KEY`(PrivateKey of your faucet account) while deployment.

If you want to use ReCaptcha, set both variables `RECAPTCHA_CLIENT_SECRET` and `RECAPTCHA_SERVER_SECRET`.

## :whale: Dockerimage

- [symbolplatform\/symbol-faucet | Docker Hub](https://hub.docker.com/r/symbolplatform/symbol-faucet)

## :shell: Claimimg without Browser

```shell
curl http://localhost:4000/claims -d 'recipient=__YOUR_ADDRESS__'
```

## :fire: Customize

```shell
# set enviroment variables
# DEFAULT_NODE
# HOST
# PORT= (default: 3000)
# NATIVE_CURRENCY_NAME
# NATIVE_CURRENCY_ID
# NATIVE_CURRENCY_OUT_MAX
# NATIVE_CURRENCY_OUT_MIN
# FAUCET_PRIVATE_KEY
# MAX_FEE
# ENOUGH_BALANCE
# MAX_UNCONFIRMED
# BLACKLIST_MOSAIC_IDS
# EXPLORER_URL
# see .env.sample

# install packages
$ npm install

# start app
$ npm start

# or for development
$ npm run dev
```

## :muscle: Powered by

- [symbol-sdk-typescript-javascript](https://github.com/symbol/symbol-sdk-typescript-javascript)
- [nuxt/nuxt\.js: The Vue\.js Framework](https://github.com/nuxt/nuxt.js)
- [44uk/symbol\-faucet: Faucet application for symbol \(catapult\)](https://github.com/44uk/symbol-faucet)

