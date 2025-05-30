import { WagmiProvider } from "wagmi";
import { config } from "./config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Panagram from "./components/Panagram.tsx";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div>
          <Panagram />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
