import { compile, createFileManager } from "@noir-lang/noir_wasm";
import main from "../../../circuits/src/main.nr?url";
import nargoToml from "../../../circuits/Nargo.toml?url";

import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

export async function getCircuit() {
    const fm = createFileManager("/");
    const mainResponse = await fetch(main);
    const nargoTomlResponse = await fetch(nargoToml);
  
    const mainBody = mainResponse.body;
    const nargoTomlBody = nargoTomlResponse.body;
  
    if (!mainBody || !nargoTomlBody) {
      throw new Error("Failed to fetch required files.");
    }
  
    fm.writeFile("./src/main.nr", mainBody);
    fm.writeFile("./Nargo.toml", nargoTomlBody);
  
    return await compile(fm);
  }