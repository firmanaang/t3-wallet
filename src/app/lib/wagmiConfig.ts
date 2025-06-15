import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// Get projectId from environment or use a development fallback
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || (process.env.NODE_ENV === 'development' ? 'development_project_id' : undefined)

// Only throw error in production
if (!projectId && process.env.NODE_ENV === 'production') {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, arbitrum]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId: projectId as string,
  networks
})

export const config = wagmiAdapter.wagmiConfig
