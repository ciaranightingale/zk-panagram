import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { abi } from "../abi/abi.ts";
import createPedersenHash from "../utils/computeHash.ts";
import { uint8ArrayToHex } from "../utils/splitProof.ts";
import { PANAGRAM_CONTRACT_ADDRESS } from "../constant.ts";
import { GenerateProof } from "../utils/generateProof.ts";

export default function Input() {
  const { data: hash, isPending, writeContract, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState("");

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

      const { cleanProof: proof } = await GenerateProof(guess, showLog);
      console.log("proof", proof);
      console.log("proofHex", uint8ArrayToHex(proof));

      // Send transaction and get transaction hash
      await writeContract({
        address: PANAGRAM_CONTRACT_ADDRESS,
        abi: abi,
        functionName: "verifyEqual",
        args: [uint8ArrayToHex(proof)],
      });
    } catch (error: unknown) {
      // Catch and log any other errors
      console.error(error);

      // Show log that something went wrong
      showLog("Error submitting transaction 💔");
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
