const fs = require('fs');
const {
  loadPayer, establishConnection, loadProgram,
  loadRegisters
} = require('./network');

const programData = fs.readFileSync('./dist/program/solana_escrow.so');
const schema = require('../configs/schema.json');

(async () => {
  const connection = await establishConnection();
  const payer = await loadPayer(connection);
  const program = await loadProgram(programData, payer, connection);
  const registers = await loadRegisters(schema, payer, program, connection)

  console.log('Deployment Info:');
  console.log('\tProgram:', program.address);

  registers.forEach(({ address, key }) => {
    console.log(`\tRegister \'${key}\': ${address}`);
  });

})();
