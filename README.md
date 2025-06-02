# Onchain Dice Game

Roll the dice and win!

[Live Demo](https://dice-game-sooty-two.vercel.app/)

## Features

- Roll a dice on the blockchain
- Fair and transparent game mechanics
- Bet 0.01 ETH to play
- Win 1.5x your bet if you win the bet
- Uses Chainlink VRF for provably fair randomness

## Technologies Used

- Solidity for smart contract development
- Foundry for testing and deployment
- Chainlink VRF for randomness
- Next.js for the frontend
- Tailwind CSS for styling
- Ethers.js for blockchain interactions
- Privy for user authentication
- Subgraph for indexing blockchain data

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/unniznd/dice_game.git
    cd dice_game
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add your environment variables:

   ```bash
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   GRAPH_API_KEY=your_graph_api_key
   ```

4. Navigate to the `dice_game_contract` directory and run the following command to compile the smart contracts:
   ```bash
   forge install
   forge test
   forge build
   ```
5. Deploy the smart contracts to the desired network (e.g., Sepolia):
   ```bash
   forge script script/Deploy.s.sol --rpc-url <YOUR_RPC_URL> --broadcast
   ```
6. Make sure to fund your wallet with test ETH for the Sepolia network to interact with the smart contract.

7. To run the subgraph, navigate to the `dice-game-subgraph` directory and run:
   ```bash
   yarn install
   graph codegen
   graph build
   graph deploy --product hosted-service <YOUR_SUBGRAPH_NAME>
   ```
8. Make sure to replace `<YOUR_SUBGRAPH_NAME>` with your actual subgraph name.
9. Make sure to replace contract addresses in the frontend with the deployed contract address in `utils/constants.tsx`.
10. To run the frontend, navigate back to the root directory and run:
    ```bash
    npm run dev
    ```
