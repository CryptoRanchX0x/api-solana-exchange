import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Keypair,
} from '@solana/web3.js';
import bs58 from 'bs58';

@Injectable()
export class TransactionService {

  constructor(
    @Inject('SOLANA_CONNECTION')
    private readonly connection: Connection,
  ) { }

  async createTransaction(from: string, to: string, amount: number) {
    try {
      const tx = new Transaction();
      const fromPubkey = new PublicKey(from);
      const toPubkey = new PublicKey(to);
      tx.add(
        SystemProgram.transfer({
          fromPubkey: fromPubkey,
          toPubkey: toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      );

      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();

      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
      tx.feePayer = fromPubkey;

      return {
        rawTransaction: Buffer.from(
          tx.serialize({ requireAllSignatures: true, verifySignatures: false }),
        ).toString('hex'),
      };

    } catch (error) {
      console.error("Error creating transaction:", error);
      throw new BadRequestException(error.transactionMessage || 'Failed to create transaction');
    }
  }

  signTransaction(rawTransaction: string, secretKey: string) {
    try {
      const txFromHex = Buffer.from(rawTransaction, 'hex');
      const tx = Transaction.from(txFromHex);

      const secretKeyDecode = bs58.decode(secretKey);
      const keypair = Keypair.fromSecretKey(secretKeyDecode);
      console.log(keypair);

      tx.sign(keypair);

      return {
        signedTransaction: Buffer.from(tx.serialize()).toString('hex'),
      };

    } catch (error) {
      console.error("Error signing transaction:", error);
      throw new BadRequestException(error.transactionMessage || 'Failed to sign transaction');
    }
  }

  async sendTransaction(signedTransaction: string) {
    try {
      const txFromHex = Buffer.from(signedTransaction, 'hex');
      console.log(txFromHex);
      const tx = Transaction.from(txFromHex);
      const signature = await this.connection.sendRawTransaction(tx.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });
      return {
        signature: signature,
      };
      
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw new BadRequestException(error.transactionMessage || 'Failed to send transaction');
    }
  }
}
