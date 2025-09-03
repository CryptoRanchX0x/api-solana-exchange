import { Inject, Injectable } from '@nestjs/common';
import { createMint, getMint, mintToChecked, createAssociatedTokenAccount } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

@Injectable()
export class TokensService {
    constructor(
        @Inject('SOLANA_CONNECTION')
        private readonly connection: Connection,
    ) { }

    async createMintAccount(secretKey: string, decimais: number) {

        const secretKeyDecode = bs58.decode(secretKey);
        const payer = Keypair.fromSecretKey(secretKeyDecode);

        const mint = await createMint(
            this.connection,
            payer,
            payer.publicKey,
            payer.publicKey,
            decimais
        );

        console.log("Mint Account", mint.toBase58());

        return { mintAccount: mint.toBase58() };
    }

    async getMintInfo(mintAddress: string) {

        const mintpubKey = new PublicKey(mintAddress);

        const mintInfo = await getMint(
            this.connection,
            mintpubKey
        );

        const mintInfoFormatted = {
            address: mintAddress,
            decimals: mintInfo.decimals,
            supply: mintInfo.supply.toString(),
            isInitialized: mintInfo.isInitialized,
            freezeAuthority: mintInfo.freezeAuthority?.toBase58() || null,
            mintAuthority: mintInfo.mintAuthority?.toBase58() || null,
            data: mintInfo.tlvData,
        }

        console.log("Mint Info", mintInfoFormatted);

        return { mintInfo: mintInfoFormatted };
    }

    async mint(secretKey: string,
        mintAddress: string,
        destinationAddress: string,
        amount: number,
        decimals: number) {

        const secretKeyDecode = bs58.decode(secretKey);
        const payer = Keypair.fromSecretKey(secretKeyDecode);

        const mintpubKey = new PublicKey(mintAddress);
        const destinationPubKey = new PublicKey(destinationAddress);

        const signatureTx = await mintToChecked(
            this.connection,
            payer,
            mintpubKey,
            destinationPubKey,
            payer.publicKey,
            amount,
            decimals
        );

        console.log("Minted", signatureTx);

        return { transactionSignature: signatureTx };
    }

    async createAssociatedTokenAccount(secretKey: string, mintAddress: string) {
        const secretKeyDecode = bs58.decode(secretKey);
        const payer = Keypair.fromSecretKey(secretKeyDecode);

        const mintpubKey = new PublicKey(mintAddress);

        const ata = await createAssociatedTokenAccount(
            this.connection,
            payer,
            mintpubKey,
            payer.publicKey
        );
        console.log("Associated Token Account", ata.toBase58());

        return { associatedTokenAccount: ata.toBase58() };
    }

}
