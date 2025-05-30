import { useState, useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { abi } from "../abi/abi.ts";
import { PANAGRAM_CONTRACT_ADDRESS } from "../constant.ts";
import { generateProof } from "../utils/generateProof.ts";
import { keccak256, toUtf8Bytes } from "ethers";

const FIELD_MODULUS = BigInt(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);

// taken from @aztec/bb.js/proof
export function uint8ArrayToHex(buffer: Uint8Array): string {
  const hex: string[] = [];

  buffer.forEach(function (i) {
    let h = i.toString(16);
    if (h.length % 2) {
      h = "0" + h;
    }
    hex.push(h);
  });

  return hex.join("");
}

export default function Input() {
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState("");
  const { address } = useAccount();
  
  if (!address) {
    throw new Error(
      "Address is undefined. Please ensure the user is connected."
    );
  }

  const showLog = (content: string): void => {
    setLogs((prevLogs) => [...prevLogs, content]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogs([]);
    setResults("");

    try {
      const guessInput = (document.getElementById("guess") as HTMLInputElement)
        .value;
      // Step 1: Hash the guess string
      const guessHex = keccak256(toUtf8Bytes(guessInput));

      // Step 2: Reduce the hash mod FIELD_MODULUS
      const reducedGuess = BigInt(guessHex) % FIELD_MODULUS;

      // Step 3: Convert back to hex (32-byte padded)
      const guessHash = "0x" + reducedGuess.toString(16).padStart(64, "0");

      // Step 4: Call your proof generator with the field-safe hash
      const { proof } = await generateProof(guessHash, address, showLog);

      // Send transaction and get transaction hash
      await writeContract({
        address: PANAGRAM_CONTRACT_ADDRESS,
        abi: abi,
        functionName: "makeGuess",
        args: [`0x${uint8ArrayToHex(proof)}`],
      });
    } catch (error: unknown) {
      // Catch and log any other errors
      console.error(error);
    }
  };

  // Watch for pending, success, or error states from wagmi
  useEffect(() => {
    if (isPending) {
      showLog("Transaction is processing... ⏳");
    }

    if (error) {
      showLog("Oh no! Something went wrong. 😞");
      setResults("Transaction failed.");
    }
    if (isConfirming) {
      showLog("Transaction in progress... ⏳");
    }
    // If transaction is successful (status 1)
    if (isConfirmed) {
      showLog("You got it right! ✅");
      setResults("Transaction succeeded!");
    }
  }, [isPending, error, isConfirming, isConfirmed]);

  return (
    <div>
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
    </div>
  );
}
