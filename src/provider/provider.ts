import { Connection, clusterApiUrl } from '@solana/web3.js';

export const Provider = {
  provide: 'SOLANA_CONNECTION',
  useFactory: () => {
    const network = process.env.SOLANA_NETWORK || 'local';
    const endpoint = network === 'local' 
      ? 'http://localhost:8899' 
      : clusterApiUrl(network as 'devnet' | 'testnet' | 'mainnet-beta');

    return new Connection(endpoint, 'confirmed');
  },
};
