// Import required modules
import { Barretenberg, Fr } from '@aztec/bb.js';

export default async function createPedersenHash(inputs: string[]): Promise<string> {
  // Instantiate Barretenberg
  const bb = await Barretenberg.new();

  // Convert inputs to Fr instances
  const frInputs = inputs.map(input => Fr.fromBuffer(Buffer.from(input, 'hex')));

  // Choose hashIndex (0 for basic functionality, may vary depending on your use case)
  const hashIndex = 0;

  // Compute the Pedersen hash
  const hash = await bb.pedersenHash(frInputs, hashIndex);

  return hash.toString(); // Return the resulting Fr instance directly
}

// Example Usage
// (async () => {
//   const inputs = ['a1b2c3d4e5f6', 'deadbeef1234']; // Example input hex strings
//   const result = await createPedersenHash(inputs);
//   console.log('Pedersen Hash (Fr):', result);
// })();
