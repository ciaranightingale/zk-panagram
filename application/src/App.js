import logo from './logo.svg';
import './App.css';
import PanagramInput from './PanagramInput';

// import { compile, createFileManager } from "@noir-lang/noir_wasm"

// import main from "../circuit/src/main.nr?url";
// import nargoToml from "../circuit/Nargo.toml?url";

function App() {
  return (
    <div className="App">
        <PanagramInput />
    </div>
  );
}

export default App;
