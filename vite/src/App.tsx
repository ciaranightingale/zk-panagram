import { WagmiProvider, useAccount } from 'wagmi'
import { config } from './config'
import { Account } from './account'
import { WalletOptions } from './wallet-options'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PanagramInput from './PanagramInput'

import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <div>
          <PanagramInput />
        </div>
      </QueryClientProvider> 
    </WagmiProvider>
  )
}

export default App
