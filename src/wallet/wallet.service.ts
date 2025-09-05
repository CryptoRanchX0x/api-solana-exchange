import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Keypair,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
  Commitment,
} from '@solana/web3.js';
import bs58 from 'bs58';
import * as bip39 from 'bip39';

@Injectable()
export class WalletService {

  constructor(
    @Inject('SOLANA_CONNECTION')
    private readonly connection: Connection,
  ) { }

  async generateWallet() {
    try {
      const mnemonic = bip39.generateMnemonic();

      const seed = await bip39.mnemonicToSeed(mnemonic);

      const keypair = Keypair.fromSeed(seed.subarray(0, 32));

      const publicKey: string = keypair.publicKey.toBase58();
      const secretKey: string = bs58.encode(Uint8Array.from(keypair.secretKey));

      return { publicKey, secretKey, mnemonic };
    } catch (error) {
      console.error('Error generating wallet:', error);
      throw new BadRequestException('Error generating wallet');
    }
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
      throw new BadRequestException('Erro ao solicitar airdrop: ' + error.message);
    }
  }

  async getAccountInfo(walletAddress: string) {
    try {
      const pubKey = new PublicKey(walletAddress);
      const accountInfo = await this.connection.getParsedAccountInfo(pubKey);
      console.log(accountInfo);

      return {
        success: true,
        message: 'Informações da conta',
        accountInfo,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao obter informações da conta: ' + error.message);
    }
  }

  async getRentAccount(address: string) {
    try {
      const pubKey = new PublicKey(address);
      const accountInfo = await this.connection.getAccountInfo(pubKey);
      const rentExemptionAmount =
        await this.connection.getMinimumBalanceForRentExemption(accountInfo?.data.length ?? 0);

      return {
        success: true,
        message: 'Valor mínimo para isenção de aluguel',
        rentExemptionAmount,
      };
    } catch (error) {
      console.error('Erro ao obter valor mínimo para isenção de aluguel:', error);
      throw new BadRequestException('Erro ao obter valor mínimo para isenção de aluguel: ' + error.message);
    }
  }

  async createWallet(payerSecretKey: string) {

    try {
      const secretKeyDecode = bs58.decode(payerSecretKey);
      const payer = Keypair.fromSecretKey(secretKeyDecode);
      console.log('Payer Public Key:', payer.publicKey.toBase58());
  
      const newUserAccount = Keypair.generate();

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: newUserAccount.publicKey,
          lamports: 0,
          space: 0,
          programId: SystemProgram.programId,
        })
      );
  
      const signature = await sendAndConfirmTransaction(this.connection, transaction, [payer, newUserAccount]);
      console.log('Conta de usuário criada:', newUserAccount.publicKey.toBase58());
      console.log('Signature da transação:', signature);
      return {
        publicKey: newUserAccount.publicKey.toBase58(),
        secretKey: bs58.encode(Uint8Array.from(newUserAccount.secretKey)),
        transactionSignature: signature,
      };
      
    } catch (error) {
      console.error('Erro ao criar conta de usuário:', error);
      throw new BadRequestException(error.transactionMessage);
    }
  }
}
