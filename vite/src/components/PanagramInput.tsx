import { useState } from 'react';
import PanagramImage from "./PanagramImage.tsx";
import { bytesToHex } from 'viem';

import { UltraHonkBackend, splitHonkProof } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import {abi} from '../abi/abi.ts';
import ConnectWallet from './ConnectWallet.tsx';
import { getCircuit } from '../utils/getCircuit.ts';
import createPedersenHash from '../utils/computeHash.ts';
import { hash } from 'crypto';
import { hexlify } from 'ethers';

function uint8ArrayToHex(uint8Array: Uint8Array): string {
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function PanagramInput() {
  const { data, isPending, writeContract, isSuccess } = useWriteContract();
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState("");

  const showLog = (content: string): void => {
    setLogs(prevLogs => [...prevLogs, content]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogs([]);
    setResults("");

    try {
      const { program } = await getCircuit();
      const noir = new Noir(program);
      const backend = new UltraHonkBackend(program.bytecode);
      const guessRaw = (document.getElementById("guess") as HTMLInputElement).value;
      const guess = await createPedersenHash([guessRaw]);
      console.log("guess", guess);
      const answer = "0x2df8b940e5890e4e1377e05373fae69a1d754f6935e6a780b666947431f2cdcd";
      showLog("Generating witness... ⏳");
      const { witness } = await noir.execute({ guess: guess, expected_hash: answer });
      showLog("Generated witness... ✅");
 
      showLog("Generating proof... ⏳");
      const proof = await backend.generateProof(witness);
      showLog("Generated proof... ✅");

      console.log("results", proof.proof);
      showLog('Verifying proof... ⌛');
      // const isValid = await backend.verifyProof(proof);
      // const { proof: proofWithoutPublicInputs, publicInputs } = splitHonkProof(proof.proof);
      const proofHex = bytesToHex(proof.proof)
      console.log("proofHex", proofHex);
      writeContract({
        address: '0x056b597b91f6f128a999B8F6d5acE149a35E2F7A',
        abi: abi,
        functionName: 'verifyEqual',
        args: [proofHex],
      });
      console.log("data", data);
      if (isSuccess) {
        data ? showLog('Proof verified... ✅') : showLog('Proof verification failed... ❌');
      }
    } catch (error: unknown) {
      showLog("Oh 💔");
      console.error(error);
    }
  };

  const { isConnected } = useAccount();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Panagram
        </h1>
        {isConnected && (
          <>
            <div className="w-full flex justify-center mb-6">
              <ConnectWallet />
            </div>
            <PanagramImage />
            <p className="text-center text-gray-600 mb-6">
              Can you guess the secret word?
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                type="text"
                id="guess"
                maxLength={9}
                placeholder="Type your guess"
                className="w-full px-6 py-4 text-lg text-gray-700 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center"
              />
              <button
                type="submit"
                id="submit"
                className="w-full px-6 py-4 text-lg font-medium text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Submit Guess
              </button>
            </form>
            <div id="logs" className="mt-4 text-gray-700">
              {logs.map((log, index) => (
                <div key={index} className="mb-2">{log}</div>
              ))}
            </div>
            <div id="results" className="mt-4 text-gray-700">
              {results && <div className="font-semibold">{results}</div>}
            </div>
          </>
        )}
        {!isConnected && (
          <div className="w-full flex justify-center mb-6">
            <ConnectWallet />
          </div>
        )}
      </div>
    </div>
  );
}

export default PanagramInput;
