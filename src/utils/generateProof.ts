import { UltraHonkBackend, } from "@aztec/bb.js";
import circuit from "../../circuits/target/panagram.json";
// @ts-ignore
import { Noir } from "@noir-lang/noir_js";

import { CompiledCircuit } from '@noir-lang/types';

import { ANSWER_HASH } from "../constant";


export async function generateProof(guess: string, address: string, showLog:(content: string) => void): Promise<{ proof: Uint8Array, publicInputs: string[] }> {
  try {
    const noir = new Noir(circuit as CompiledCircuit);
    const honk = new UltraHonkBackend(circuit.bytecode, { threads: 1 });
    const inputs = { guess: guess, address: address, expected_hash: ANSWER_HASH };

    showLog("Generating witness... ⏳");
    const { witness } = await noir.execute(inputs);
    showLog("Generated witness... ✅");

    showLog("Generating proof... ⏳");
    const { proof, publicInputs } = await honk.generateProof(witness, { keccak: true });
    const offChainProof = await honk.generateProof(witness);
    showLog("Generated proof... ✅");
    showLog("Verifying proof... ⏳");
    const isValid = await honk.verifyProof(offChainProof);
    showLog(`Proof is valid: ${isValid} ✅`);

    // no longer needed for bb:)
    // const cleanProof = proof.slice(4); // remove first 4 bytes (buffer size)
    return { proof, publicInputs };
  } catch (error) {
    console.log(error);
    throw error;
  }
};