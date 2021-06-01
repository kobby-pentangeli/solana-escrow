const {
  Account, Connection, BPF_LOADER_PROGRAM_ID,
  SystemProgram, Transaction, sendAndConfirmTransaction,
  BpfLoader, PublicKey,
} = require('@solana/web3.js');
const fs = require('fs').promises;
const soproxABI = require('soprox-abi');
const store = require('./store');
const escrowConfig = require('../solana.escrow.config.json');

/**
 * Establish a connection to the cluster
 */
const establishConnection = async () => {
  const connection = new Connection(escrowConfig.network.devnet, 'recent');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', escrowConfig.network.devnet, version);
  return connection;
}

/**
 * Establish an account to pay for everything
 */
const loadPayer = async (_connection) => {
    const keypair = escrowConfig.keypairPath;

    if (!keypair) throw new Error('Payer not set up yet');

    const keypairString = await fs.readFile(keypair, {encoding: 'utf8'});
    const keypairBuffer = Buffer.from(JSON.parse(keypairString));

    return new Account(keypairBuffer);
}

/**
 * Deploy a program to the cluster
 */
const deployProgram = async (data, payer, connection) => {
  const program = new Account();
  await BpfLoader.load(
    connection,
    payer,
    program,
    data,
    BPF_LOADER_PROGRAM_ID,
  );
  return program;
}

/**
 * Deploy a register to the cluster
 */
const deployRegister = async (space, payer, programId, connection) => {
  const register = new Account();
  let transaction = new Transaction();
  const lamports = await connection.getMinimumBalanceForRentExemption(space);
  transaction.add(SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: register.publicKey,
    lamports,
    space,
    programId,
  }));
  await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, register],
    { skipPreflight: true, commitment: 'recent' }
  );
  return register;
}

/**
 * Load the escrow BPF program if not already loaded
 */
const loadProgram = async (data, payer, connection) => {
  const filename = 'program';
  // Check if the program has already been loaded
  const config = store.load(filename);
  history: if (config) {
    const { address, data: prevData } = config;
    if (Buffer.from(data).toString('hex') != prevData) break history;
    console.log('The program has been loaded at:', address);
    const program = {
      publicKey: new PublicKey(address),
      ...config
    }
    return program;
  }

  // Load the program
  const _program = await deployProgram(data, payer, connection);
  const address = _program.publicKey.toBase58();
  console.log('Deploying the program:', address);

  // Save this info for next time
  let program = {
    address,
    secretKey: Buffer.from(_program.secretKey).toString('hex'),
    data: Buffer.from(data).toString('hex')
  }
  store.save(filename, program);
  program.publicKey = _program.publicKey;
  return program;
}

/**
 * Load registers
 */
const loadRegisters = async (schema, payer, program, connection) => {
  const filename = 'abi';
  const data = store.load(filename);

  const { programAddress, schema: storedSchema } = data || {};
  if (programAddress == program.address && storedSchema)
    return storedSchema.map(register => {
      register.publicKey = new PublicKey(program.address);
      return register;
    });

  const layout = await Promise.all(schema.map(async each => {
    const space = soproxABI.span(each);
    const account = await deployRegister(space, payer, program.publicKey, connection);
    each.address = account.publicKey.toBase58();
    each.secretKey = Buffer.from(account.secretKey).toString('hex');
    return each;
  }));
  store.save(filename, {
    programAddress: program.address,
    schema: layout
  });
  return layout.map(register => {
    register.publicKey = new PublicKey(register.address);
    return register;
  });
}

module.exports = {
  establishConnection, loadPayer, deployProgram, deployRegister,
  loadProgram, loadRegisters
}
