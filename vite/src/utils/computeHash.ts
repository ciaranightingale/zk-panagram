// Import required modules
import { Barretenberg, Fr } from '@aztec/bb.js';
import { createHash } from 'crypto';

export default async function createPedersenHash(inputs: string[]): Promise<string> {
  // Instantiate Barretenberg
  const bb = await Barretenberg.new();
  
  // Convert inputs to Fr instances
  const frInputs = inputs.map(str => Fr.fromBuffer(createHash('sha256').update(str, 'utf-8').digest()));

  // Choose hashIndex (0 for basic functionality, may vary depending on your use case)
  const hashIndex = 0;

  // Compute the Pedersen hash
  const hash = await bb.pedersenHash(frInputs, hashIndex);

  return hash.toString(); // Return the resulting Fr instance as string
}

// Example Usage
(async () => {
  const inputs = ['triangle']; // Example input hex strings
  const result = await createPedersenHash(inputs);
  console.log('Pedersen Hash (Fr):', result);
})();
