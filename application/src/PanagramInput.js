import { useState } from 'react';
import PanagramImage from "./PanagramImage";
import { compile, createFileManager } from "@noir-lang/noir_wasm";
import main from "main.nr?url";
import nargoToml from "Nargo.toml?url";
import { UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";
await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

export async function getCircuit() {
  const fm = createFileManager("/");
  const { body } = await fetch(main);
  const { body: nargoTomlBody } = await fetch(nargoToml);

  fm.writeFile("./src/main.nr", body);
  fm.writeFile("./Nargo.toml", nargoTomlBody);
  return await compile(fm);
}

function PanagramInput() {
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState("");

  const showLog = (content) => {
    setLogs(prevLogs => [...prevLogs, content]);  // Add new log
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the form from submitting the traditional way
    setLogs([]); // Clear logs when resubmitting
    setResults(""); // Clear results when resubmitting

    try {
      const { program } = await getCircuit();
      const noir = new Noir(program);
      const backend = new UltraHonkBackend(program.bytecode);
      const guess = document.getElementById("guess").value;
      console.log(guess);

      showLog("Generating witness... ⏳");
      const { witness } = await noir.execute({ guess });
      showLog("Generated witness... ✅");

      showLog("Generating proof... ⏳");
      const proof = await backend.generateProof(witness);
      showLog("Generated proof... ✅");

      console.log("results", proof.proof);
      showLog('Verifying proof... ⌛');
      const isValid = await backend.verifyProof(proof);
      setResults(`Proof is ${isValid ? "valid" : "invalid"}... ✅`);
    } catch (error) {
      showLog("Oh 💔");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
      <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Panagram
        </h1>
        <PanagramImage />
        <p className="text-center text-gray-600 mb-6">
          Can you guess the secret word?
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            id="guess"
            maxLength="9"
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

        {/* Display logs */}
        <div id="logs" className="mt-4 text-gray-700">
          {logs.map((log, index) => (
            <div key={index} className="mb-2">{log}</div>
          ))}
        </div>

        {/* Display results */}
        <div id="results" className="mt-4 text-gray-700">
          {results && <div className="font-semibold">{results}</div>}
        </div>
      </div>
    </div>
  );
}

export default PanagramInput;
