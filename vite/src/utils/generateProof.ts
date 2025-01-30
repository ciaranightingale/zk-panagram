import { UltraHonkBackend } from "@aztec/bb.js";
import circuit from "../../../circuits/target/panagram.json";
// @ts-ignore
import { Noir } from "@noir-lang/noir_js";

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

import { CompiledCircuit } from '@noir-lang/types';

await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

export async function GenerateProof(guess: string, showLog:(content: string) => void): Promise<{ cleanProof: Uint8Array, publicInputs: string[] }> {
  try {
    const noir = new Noir(circuit as CompiledCircuit);
    const honk = new UltraHonkBackend(circuit.bytecode, { threads: 1 });
      
    const inputs = { guess: guess, expected_hash: "0x2df8b940e5890e4e1377e05373fae69a1d754f6935e6a780b666947431f2cdcd" };

    showLog("Generating witness... ⏳");
    const { witness } = await noir.execute(inputs);
    showLog("Generated witness... ✅");

    showLog("Generating proof... ⏳");
    const { proof, publicInputs } = await honk.generateProof(witness, { keccak: true });
    showLog("Generated proof... ✅");

    const cleanProof = proof.slice(4); // remove first 4 bytes (buffer size)
    return { cleanProof, publicInputs };
  } catch (error) {
    console.log(error);
    throw error;
  }
};