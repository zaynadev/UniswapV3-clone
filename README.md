# Uniswap v3 clone

Swap WETH for UNI using uniswap v3 sdk and hardhat mainnet fork

#### 1. server

Go inside server forlder using this command

```shell
cd server
```

Create an empty `.env` file in the base directory of this project.

Add the following line to the `.env` file replacing `YOUR_ALCHEMY_URL_MAINNET` with your url.

```sh
ALCHEMY_URL_MAINNET=YOUR_ALCHEMY_URL_MAINNET
```

Install project dependencies by running this commands:

```shell
npm install
```

Run the hardhhat node:

```shell
npx hardhat node
```

In another terminal run this command to send faucet WETH to your first hardhat account:

```shell
npx hardhat run script.js
```

#### 2. client

Go inside client folder using this command

```shell
cd client
```

Install project dependencies by running this command:

```shell
npm install
npm start
```

#### 3. Metamask

Import the first hardhat account private key in metamask
