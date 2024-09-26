create a monorepo of microservices

nest new monorepo

cd monorepo/

// create new serive
nest generate app api-gateway
nest generate app users

remove the apps/monorepo/
remove apps/monorepo/ from nest-cli.json => change the entry point to /apps/api-gateway

yarn add @nestjs/microservices
yarn add amqplib amqp-connection-manager
yarn add dotenv

nest generate library contracts
rm -rf libs/contracts/src/*

// create new module
nest generate resource users

[for DTO]
yarn add class-validator class-transformer

yarn start:dev

yarn add @nestjs/mongoose mongoose