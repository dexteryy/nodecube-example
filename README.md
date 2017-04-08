
# nodecube-example

[![Build Status][travis-image]][travis-url]
[![Dependencies Status][dep-image]][dep-url]
[![Test Coverage][coveralls-image]][coveralls-url]

[travis-image]: https://img.shields.io/travis/dexteryy/nodecube-example/master.svg
[travis-url]: https://travis-ci.org/dexteryy/nodecube-example
[dep-image]: https://david-dm.org/dexteryy/nodecube-example.svg
[dep-url]: https://david-dm.org/dexteryy/nodecube-example
[coveralls-image]: https://img.shields.io/coveralls/dexteryy/nodecube-example/master.svg
[coveralls-url]: https://coveralls.io/r/dexteryy/nodecube-example?branch=master

Boilerplate code and a demo for HTTP API projects based on nodecube.

> * [nodecube](https://github.com/dexteryy/webcube): nodecube is a batch of continuously updated base code and configurations for the minimal modern node.js service that conform to [RESTful API](https://github.com/marmelab/awesome-rest#design), [12-Factor App](https://12factor.net/), [Microservice Architecture](https://github.com/mfornos/awesome-microservices#theory)
> * nodecube-cli: TODO

## Setup

```
cp configs/env.sample.config env.config
```

For developers in China:

```
cp ./node_modules/nodecube/configs/Dockerfile-china Dockerfile-dev
```

For other developers:

```
cp Dockerfile Dockerfile-dev
```

Install dependencies: (only for npm scripts)

```bash
yarn
```

or

```bash
npm install
```

## Create or update containers for development environment

Remove all old containers and images, build new ones and run testing

```
npm run dev:rebuild
```

Just remove database containers and images

```
npm run dev:empty
```

Just remove all containers and images

```
npm run dev:rebuild
```

## Local testing

```
npm run lint
```

```
npm run dev:test
```

## Running in development environment

```
npm run dev
```

```
npm run dev:debug
```

## Running in production (or staging) environment

Need a new `docker-compose.yml` with reconfigured environment variables

## Continuous integration

Send pull request to `master` branch

## Continuous deployment

Send pull request to `production` (or `staging`) branch
