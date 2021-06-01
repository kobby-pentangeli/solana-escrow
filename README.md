# Solana Escrow

An escrow program (smart contract) built for the Solana blockchain

## TODO

Due to time constraints, only an `initializer.js` has been included in the `/tests` folder to demonstrate
what's possible, and to provide a stepping stone for interested developers.

Thus, the following are the THREE KEY FUNCTIONALITIES yet to be implemented:

- Tests that exercise the SPL token program
- Tests that exercise the escrow program
- A UI for the escrow program

## Environment Setup

1. Install Rust from <https://www.rust-lang.org/tools/install>
2. Visit <https://docs.solana.com/cli/install-solana-cli-tools> to get the Solana CLI tools on your machine:

### MacOS & Linux

- Open your favorite Terminal application

- Install the Solana release `v1.6.10` on your machine by running:

```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.6.10/install)"
```

You can replace `v1.6.10` with the release tag matching the software version of your desired release, or use one of the three symbolic channel names: `stable`, `beta`, or `edge`.

The following output indicates a successful update:

```bash
downloading v1.6.10 installer
Configuration: /home/solana/.config/solana/install/config.yml
Active release directory: /home/solana/.local/share/solana/install/active_release
* Release version: v1.6.10
* Release URL: https://github.com/solana-labs/solana/releases/download/v1.6.10/solana-release-x86_64-unknown-linux-gnu.tar.bz2
Update successful
```

#### Troubleshooting

If there are errors installing the Solana CLI tools... such as the following:

```bash
 --- stderr
  thread 'main' panicked at 'Unable to find libudev: Failure { command: "\"pkg-config\" \"--libs\" \"--cflags\" \"libudev\"", output: Output { status: ExitStatus(ExitStatus(256)), stdout: "", stderr: "Package libudev was not found in the pkg-config search path.\nP
erhaps you should add the directory containing `libudev.pc\'\nto the PKG_CONFIG_PATH environment variable\nNo package \'libudev\' found\n" } }', /home/ccdle12/.cargo/registry/src/github.com-1ecc6299db9ec823/hidapi-1.2.6/build.rs:53:54
  note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
warning: build failed, waiting for other jobs to finish...
error: failed to compile `spl-token-cli v2.0.11`, intermediate artifacts can be found at `/tmp/cargo-installd5uUAO`
```

- Install `pkg-config` (on Linux):

```bash
apt-get install libssl-dev libudev-dev pkg-config zlib1g-dev llvm clang make
```

- If the following prompt appears after installation:

```bash
Please update your PATH environment variable to include the 
solana programs:
PATH="<your-solana-bin-path>”
```

OPTION 1: Close your terminal and then open it again to activate the environment variables

OPTION 2:

- Open `~/.bashrc` or whichever shell you are using and add `export PATH=”<your-solana-bin-path”>`

---

## Application setup

Follow these instructions to build and deploy the escrow program on devnet.

1. Install the latest version of NodeJS and npm. You can download both at <https://nodejs.org/en/download/>.
2. Clone the repository.
3. Navigate to the root folder of the application in the command line.
4. `npm install` to install required npm packages and/or dependencies.
5. `npm run build` will compile the smart contracts.
6. Check that Solana was installed:

```bash
solana --version
```

7. View the current Solana configuration:

```bash
solana config get
```

- You should see some output like this:

```bash
Config File: /home/YOUR-USERNAME/.config/solana/cli/config.yml
RPC URL: https://api.mainnet-beta.solana.com
WebSocket URL: wss://api.mainnet-beta.solana.com/ (computed)
Keypair Path: /home/YOUR-USERNAME/.config/solana/id.json
Commitment: confirmed
```

8. Switch to devnet:

```bash
solana config set --url https://devnet.solana.com
```


9. Generate a keypair:

```bash
solana-keygen new
```

- Make a note of the generated pubkey and seed phrase, e.g.:

```bash
pubkey: 5werYWXT4SgtsoV91u9zG6BNngtMKFKsY76L21yZTNKN
Seed phrase: <foo>
```

10. Request SOL from the devnet faucet

```bash
solana airdrop 1
```

11. Deploying the smart contracts requires access to the host machine's `secretKey`. Update `solana.escrow.config.json` with the path to the keypair generated previously:

```json
"keypairPath": "/home/YOUR-USERNAME/.config/solana/id.json"
```

12. `npm run deploy` the program (smart contract) to the specified network in `solana.escrow.config.json`.
