<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
</p>

## Solana Blockchain

Este projeto utiliza a blockchain Solana para criar carteiras, realizar transações.

- [Solana Documentation](https://solana.com/pt/docs?locale=docs)
- [Solana Developers Cookbook](https://solana.com/pt/developers/cookbook)

## Author

[Marco Monteiro](https://www.linkedin.com/in/marcoasmonteiro/)


## Description

This project is an API built with the NestJS framework for studying the Solana blockchain, focusing on wallet management and transactions. It utilizes the JavaScript library [@solana/web3.js](https://www.npmjs.com/package/@solana/web3.js) and [@solana/spl-token](https://www.npmjs.com/package/@solana/spl-token) for interacting with the Solana network. All examples follow the official Solana documentation, especially the guide on [offline transactions](https://solana.com/pt/developers/cookbook/transactions/offline-transactions).

## Project setup

```bash
$ npm install

# Node local
$ npm run start:local

# Solana Devnet
$ npm run start:devnet

# Solana Testnet
$ npm run start:testnet

# Solana Mainnet
$ npm run start:mainnet
```

## API Solana Exchange

Utilize a collection de requisições disponível no caminho `/docs/collection_api.json` para testar os endpoints da API.

### Wallet

#### Create Wallet
- **URL**: `/wallet/create-wallet`
- **Method**: `POST`
- **Description**: Creates a new Solana wallet.

**Response:**
```json
{
  "publicKey": "string",
  "secretKey": "string",
  "mnemonic": "string"
}
```

#### Request Airdrop
- **URL**: `/wallet/airdrop/:address`
- **Method**: `GET`
- **Description**: Requests an airdrop of 1 SOL to the specified wallet address.
- **Parameters**:
  - `address` (string): The public key of the wallet.

**Response:**
```json
{
  "success": true,
  "message": "string",
  "transactionSignature": "string",
  "confirmationResult": "object"
}
```

#### Get Account Info
- **URL**: `/wallet/account-info/:address`
- **Method**: `GET`
- **Description**: Retrieves information about the specified wallet address.
- **Parameters**:
  - `address` (string): The public key of the wallet.

**Response:**
```json
{
  "success": true,
  "message": "string",
  "accountInfo": "object"
}
```

### Transaction

#### Create Transaction
- **URL**: `/transaction/create-transaction`
- **Method**: `POST`
- **Description**: Creates a new transaction from one wallet to another.

**Body:**
```json
{
  "from": "string",
  "to": "string",
  "amount": "number"
}
```

**Response:**
```json
{
  "rawTransaction": "string"
}
```

#### Sign Transaction
- **URL**: `/transaction/sign-transaction`
- **Method**: `POST`
- **Description**: Signs a raw transaction with the provided secret key.

**Body:**
```json
{
  "rawTransaction": "string",
  "secretKey": "string"
}
```

**Response:**
```json
{
  "signedTransaction": "string"
}
```

#### Send Transaction
- **URL**: `/transaction/send-transaction`
- **Method**: `POST`
- **Description**: Sends a signed transaction to the Solana network.

**Body:**
```json
{
  "rawTransactionSigned": "string"
}
```

**Response:**
```json
{
  "signature": "string"
}
```

## License
This project is licensed under the MIT License - see the LICENSE file for details.