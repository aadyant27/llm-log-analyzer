# Features

- If same file is uploaded again, then the embedding for that file is skipped, instead of just upserting it.

# TODOs

### **URGENT**

- Add validation of query string in POST API
- ~~ Add Monitoring ~~
- Add log collection
- Streaming
- RabbitMQ/Kafka
- Add cost analysis of embedding
- MAP REDUCE for large logs
- Avoid embedding duplicates

### General Issues:

- ~~Integrate Docker~~
- Add try-catch, error-stack
- Segregate dtos/interface files into separate folders
- Add types, remove 'any' type
- Add eslint checks/tests to the pipeline
- Logger service for better logging(Use messagingQueue like RabbitMQ/Kafka to send & store the logs) and then **LOG COLLECTION MONITORING**
- Add TESTs
- Add Monitoring of API, using prometheus, Loki, Grafana, etc
- Batching, concurrency, and rate limits
- Add authorization mechanism

### langchain-pinecone.service.ts

- Batch documents before fetch/upsert to avoid hitting request size limits

### logs.controller.ts

- Whitelist of allowed file types can be implemented here
- Use stream processing for large files
- Send files to s3

### logs-summarize.service.ts

- Use DESIGN PATTERNS for better scalability of LLM integration
- Design pattern to allow for easy integration with any of the LLM APIs

### logs.service.ts

- Break the service file into components, and place all these components in the /logic folder.
- Only function calls should be made in logs.service.ts to increase readability and manageability.

## DOCS

- Add docs to generate openAI API key
- Steps to run docker
- Steps to create .env file

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
