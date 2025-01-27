import { defineConfig } from '@wagmi/cli'
import { react, foundry } from '@wagmi/cli/plugins'


export default defineConfig({
  out: 'artifacts/generated.ts',
  plugins: [
    react(),
    foundry({
      project: '../contracts',
      deployments: {
        Panagram: {
          1: "0x0677dED4023054FBb90abE6deA59C2eb923AE44f"
        }
      },
    }),
  ],
});
