import { Injectable } from '@nestjs/common';
import {
  Keypair,
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Commitment,
} from '@solana/web3.js';
import bs58 from 'bs58';
import * as bip39 from 'bip39';

@Injectable()
export class WalletService {
  private readonly connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed',
  );

  async createWallet() {
    const mnemonic = bip39.generateMnemonic();

    const seed = await bip39.mnemonicToSeed(mnemonic);

    const keypair = Keypair.fromSeed(seed.slice(0, 32));

    const publicKey: string = keypair.publicKey.toBase58();
    const secretKey: string = bs58.encode(Uint8Array.from(keypair.secretKey));

    return { publicKey, secretKey, mnemonic };
  }

  async requestAirdrop(walletAddress: string, amount: number) {
    try {
      const pubKey = new PublicKey(walletAddress);
      const airdropSignature = await this.connection.requestAirdrop(
        pubKey,
        amount * LAMPORTS_PER_SOL,
      );

      const commitment: Commitment = 'confirmed';

      const confirmationResult = await this.connection.confirmTransaction(
        airdropSignature,
        commitment,
      );

      return {
        success: true,
        message: `Airdrop de ${amount} SOL enviado para ${walletAddress}`,
        transactionSignature: airdropSignature,
        confirmationResult: confirmationResult.value,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao solicitar airdrop',
        error: error.message,
      };
    }
  }

  async getAccountInfo(walletAddress: string) {
    try {
      const pubKey = new PublicKey(walletAddress);
      const accountInfo = await this.connection.getAccountInfo(pubKey);

      return {
        success: true,
        message: 'Informações da conta',
        accountInfo,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao buscar informações da conta',
        error: error.message,
      };
    }
  }
}
