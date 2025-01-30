import { useState } from "react";
import PanagramImage from "./PanagramImage.tsx";
import { UltraHonkBackend, splitHonkProof } from "@aztec/bb.js";
import { CompiledCircuit, Noir } from "@noir-lang/noir_js";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { abi } from "../abi/abi.ts";
import ConnectWallet from "./ConnectWallet.tsx";
import { getCircuit } from "../utils/getCircuit.ts";
import createPedersenHash from "../utils/computeHash.ts";
import { uint8ArrayToHex } from "../utils/splitProof.ts";
import { PANAGRAM_CONTRACT_ADDRESS } from "../constant.ts";
import { GenerateProof } from "../utils/generateProof.ts";
import NFTGalleryContainer from "./NFTGalleryContainer"; // Import the component

function PanagramInput() {
  const { data, isPending, writeContract, isSuccess } = useWriteContract();
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState("");
  const { isConnected, address: userAddress } = useAccount(); // Get user address

  const showLog = (content: string): void => {
    setLogs((prevLogs) => [...prevLogs, content]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogs([]);
    setResults("");

    try {
      const guessRaw = (document.getElementById("guess") as HTMLInputElement)
        .value;
      const guess = await createPedersenHash([guessRaw]);
      console.log("guess", guess);

      const { cleanProof: proof, publicInputs } = await GenerateProof(
        guess,
        showLog
      );
      console.log("proof", proof);
      console.log("proofHex", uint8ArrayToHex(proof));

      const isValid = writeContract({
        address: PANAGRAM_CONTRACT_ADDRESS,
        abi: abi,
        functionName: "verifyEqual",
        args: [uint8ArrayToHex(proof)],
      });
      console.log("isValid", isValid);
    } catch (error: unknown) {
      showLog("Oh 💔");
      console.error(error);
    }
  };

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

            {/* Logs and results */}
            <div id="logs" className="mt-4 text-gray-700">
              {logs.map((log, index) => (
                <div key={index} className="mb-2">
                  {log}
                </div>
              ))}
            </div>
            <div id="results" className="mt-4 text-gray-700">
              {results && <div className="font-semibold">{results}</div>}
            </div>

            {/* NFT Gallery after submission */}
            {userAddress ? (
              <NFTGalleryContainer userAddress={userAddress} />
            ) : (
              <p>No address...</p>
            )}
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
