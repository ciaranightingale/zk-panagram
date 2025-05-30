import { defineChain } from 'viem'
 
export const vMainnet = defineChain({
  id: 11155,
  name: 'Virtual Ethereum Sepolia',
  nativeCurrency: { name: 'vEther', symbol: 'vETH', decimals: 18 },
  rpcUrls: {
    default: { http: [import.meta.env.TENDERLY_RPC_URL!] }
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'import.meta.env.EXPLORER_URL!'
    }
  }
})