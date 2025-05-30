import { Barretenberg, Fr, UltraHonkBackend } from "@aztec/bb.js";
import { ethers } from "ethers";
// @ts-ignore
import { Noir } from "@noir-lang/noir_js";

// @ts-ignore
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// This gets you the equivalent of __dirname in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const circuitPath = path.resolve(__dirname, '../../circuits/target/panagram.json');

const circuit = JSON.parse(fs.readFileSync(circuitPath, 'utf8'));

// export function uint8ArrayToHex(buffer: Uint8Array): string {
//   const hex: string[] = [];

//   buffer.forEach(function (i) {
//     let h = i.toString(16);
//     if (h.length % 2) {
//       h = "0" + h;
//     }
//     hex.push(h);
//   });

//   return hex.join("");
// }

export default async function generateProof() {
  // Initialize Barretenberg
  const bb = await Barretenberg.new();

  // Get the inputs from the args
  const inputs = process.argv.slice(2);

  try {
    const noir = new Noir(circuit);
    const honk = new UltraHonkBackend(circuit.bytecode, { threads: 1 });

    const input = {
      // Public inputs
      address: inputs[1],
      expected_hash: inputs[2],

      // Private inputs
      guess: inputs[0]
    };
    const { witness } = await noir.execute(input);

    const originalLog = console.log; // Save original
    // Override to silence all logs
    console.log = () => {};

    const { proof, publicInputs } = await honk.generateProof(witness, { keccak: true });
    const offChainProof = await honk.generateProof(witness);
    const isValid = await honk.verifyProof(offChainProof);
    // Restore original console.log
    console.log = originalLog;

    const res = ethers.AbiCoder.defaultAbiCoder().encode(
        ["bytes", "bytes32[]"],
        [proof, publicInputs]
      );
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

(async () => {
    generateProof()
    .then((res) => {
      process.stdout.write(res);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
})();