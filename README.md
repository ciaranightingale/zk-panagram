# Panagram Example On-Chain ZK App

This example is an on-chain ZK panagram game that uses Noir for the ZK circuits and Foundry for the smart contracts

## Getting Started

Want to get started in a pinch? Start your project in a free Github Codespace!

[![Start your project in a free Github Codespace!](https://github.com/codespaces/badge.svg)](https://codespaces.new/noir-lang/noir-starter)

In the meantime, follow these simple steps to work on your own machine:

Install [noirup](https://noir-lang.org/docs/getting_started/installation/#installing-noirup) with

1. Install [noirup](https://noir-lang.org/docs/getting_started/installation/#installing-noirup):

   ```bash
   curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
   ```

2. Install Nargo:

   ```bash
   noirup
   ```

3. Install foundryup and follow the instructions on screen. You should then have all the foundry
   tools like `forge`, `cast`, `anvil` and `chisel`.

```bash
curl -L https://foundry.paradigm.xyz | bash
```

4. Install foundry dependencies by running `forge install 0xnonso/foundry-noir-helper --no-commit`.

5. Install `bbup`, the tool for managing Barretenberg versions, by following the instructions
   [here](https://github.com/AztecProtocol/aztec-packages/blob/master/barretenberg/bbup/README.md#installation).

6. Then run `bbup`.

## Generate verifier contract and proof

### Contract

The deployment assumes a verifier contract has been generated by nargo. In order to do this, run:

```bash
cd circuits
nargo compile
bb write_vk -b ./target/with_foundry.json
bb contract
```

A file named `contract.sol` should appear in the `circuits/target` folder.

### Test with Foundry

We're ready to test with Foundry. There's a basic test inside the `test` folder that deploys the
verifier contract, the `Starter` contract and two bytes32 arrays correspondent to good and bad
solutions to your circuit.

By running the following command, forge will compile the contract with 5000 rounds of optimization
and the London EVM version. **You need to use these optimizer settings to suppress the "stack too
deep" error on the solc compiler**. Then it will run the test, expecting it to pass with correct
inputs, and fail with wrong inputs:

```bash
forge test --optimize --optimizer-runs 5000 --evm-version cancun
```

#### Testing On-chain

You can test that the Noir Solidity verifier contract works on a given chain by running the
`Verify.s.sol` script against the appropriate RPC endpoint.

```bash
forge script script/Verify.s.sol --rpc-url $RPC_ENDPOINT  --broadcast
```

If that doesn't work, you can add the network to Metamask and deploy and test via
[Remix](https://remix.ethereum.org/).

Note that some EVM network infrastructure may behave differently and this script may fail for
reasons unrelated to the compatibility of the verifier contract.

### Deploy with Foundry

This template also has a script to help you deploy on your own network. But for that you need to run
your own node or, alternatively, deploy on a testnet.

#### (Option 1) Run a local node

If you want to deploy locally, run a node by opening a terminal and running

```bash
anvil
```

This should start a local node listening on `http://localhost:8545`. It will also give you many
private keys.

Edit your `.env` file to look like:

```
ANVIL_RPC=http://localhost:8545
LOCALHOST_PRIVATE_KEY=<the private key you just got from anvil>
```

#### (Option 2) Prepare for testnet

Pick a testnet like Sepolia or Goerli. Generate a private key and use a faucet (like
[this one for Sepolia](https://sepoliafaucet.com/)) to get some coins in there.

Edit your `.env` file to look like:

```env
SEPOLIA_RPC=https://rpc2.sepolia.org
LOCALHOST_PRIVATE_KEY=<the private key of the account with your coins>
```

#### Run the deploy script

You need to source your `.env` file before deploying. Do that with:

```bash
source .env
```

Then run the deployment with:

```bash
forge script script/Starter.s.sol --rpc-url $ANVIL_RPC --broadcast --verify
```

Replace `$ANVIL_RPC` with the testnet RPC, if you're deploying on a testnet.

## Developing on this template

This template doesn't include settings you may need to deal with syntax highlighting and
IDE-specific settings (i.e. VScode). Please follow the instructions on the
[Foundry book](https://book.getfoundry.sh/config/vscode) to set that up.

It's **highly recommended** you get familiar with [Foundry](https://book.getfoundry.sh) before
developing on this template.
