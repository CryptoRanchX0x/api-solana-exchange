import { Injectable } from '@nestjs/common';
import {
  clusterApiUrl,
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
  Keypair,
} from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

@Injectable()
export class TransactionService {
  private readonly connection = new Connection(
    clusterApiUrl('devnet'),
    'confirmed',
  );

  async createTransaction(from: string, to: string, amount: number) {
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

    tx.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash;
    tx.feePayer = fromPubkey;
    return {
      rawTransaction: Buffer.from(
        tx.serialize({ requireAllSignatures: false }),
      ).toString('hex'),
    };
  }

  signTransaction(rawTransaction: string, secretKey: string) {
    const txFromHex = Buffer.from(rawTransaction, 'hex');
    const tx = Transaction.from(txFromHex);
    const secretKeyDecode = bs58.decode(secretKey);
    const keypair = Keypair.fromSecretKey(secretKeyDecode);

    const feePayerSignature = nacl.sign.detached(
      tx.serializeMessage(),
      keypair.secretKey,
    );

    const transferSignature = nacl.sign.detached(
      tx.serializeMessage(),
      keypair.secretKey,
    );

    tx.addSignature(keypair.publicKey, Buffer.from(feePayerSignature));
    tx.addSignature(keypair.publicKey, Buffer.from(transferSignature));

    return {
      signedTransaction: Buffer.from(tx.serialize()).toString('hex'),
    };
  }

  async sendTransaction(signedTransaction: string) {
    const txFromHex = Buffer.from(signedTransaction, 'hex');
    const tx = Transaction.from(txFromHex);
    const signature = await this.connection.sendRawTransaction(tx.serialize(), {
      skipPreflight: true,
    });
    return {
      signature: signature,
    };
  }
}
