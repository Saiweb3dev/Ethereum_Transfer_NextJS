# Ethereum_Transfer_NextJS

This is a decentralized application (dApp) built with Next.js that allows users to interact with a pre-deployed Ethereum smart contract to send Ether to a specified address. The smart contract is deployed on the Sepolia test network.

## Features
- Connect to Ethereum wallet (using MetaMask)
- Enter the recipient's Ethereum address
- Enter the amount of Ether to send
- Send the Ether transaction through the pre-deployed smart contract

## Installation

1. Clone the repository:
```
git clone https://github.com/Saiwebdev2005/Ethereum_Transfer_NextJS.git
```

2. Install the dependencies:
```
cd Ethereum_Transfer_NextJS
npm install
```


## Usage

1. Start the development server:
```
npm run dev
```

2. Open your web browser and navigate to `http://localhost:3000`.

3. Connect your Ethereum wallet (MetaMask) to the Sepolia test network.

4. Enter the recipient's Ethereum address and the amount of Ether to send.

5. Click the "Send" button to initiate the transaction. MetaMask will prompt you to confirm the transaction.

## Smart Contract

The smart contract for this project has been pre-deployed to the Sepolia test network. The contract address is specified in the `.env.local` file.

## Frontend

The frontend of this project is built using Next.js and interacts with the Ethereum smart contract using the Web3.js library.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Submit a pull request to the main repository.

## License

This project is licensed under the [MIT License](LICENSE).
