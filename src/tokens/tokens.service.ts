import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createMint, getMint, mintToChecked, getOrCreateAssociatedTokenAccount, createAccount, transferChecked } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

@Injectable()
export class TokensService {
    constructor(
        @Inject('SOLANA_CONNECTION')
        private readonly connection: Connection,
    ) { }

    async createMintAccount(secretKey: string, decimais: number) {
        try {
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
        } catch (error) {
            console.error("Error creating mint account:", error);
            throw new BadRequestException(error.transactionMessage || 'Failed to create mint account');
        }
    }

    async getMintInfo(mintAddress: string) {
        try {
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

        } catch (error) {
            console.error("Error fetching mint info:", error);
            throw new BadRequestException(error.transactionMessage || 'Failed to fetch mint info');
        }
    }

    async mint(secretKey: string,
        mintAddress: string,
        destinationAddress: string,
        amount: number,
        decimals: number) {

        try {
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
        } catch (error) {
            console.error("Error minting tokens:", error);
            throw new BadRequestException(error.transactionMessage || 'Failed to mint tokens');
        }
    }

    async createTokenAccount(secretKey: string, mintAddress: string) {
        try {
            const secretKeyDecode = bs58.decode(secretKey);
            const payer = Keypair.fromSecretKey(secretKeyDecode);

            const mintpubKey = new PublicKey(mintAddress);

            const tokenAccount = await createAccount(
                this.connection,
                payer,
                mintpubKey,
                payer.publicKey
            );
            console.log("Token Account", tokenAccount.toBase58());

            return { tokenAccount: tokenAccount.toBase58() };

        } catch (error) {
            console.error("Error creating token account:", error);
            throw new BadRequestException(error.transactionMessage || 'Failed to create token account');
        }
    }

    async createAssociatedTokenAccount(secretKey: string, mintAddress: string) {
        try {
            const secretKeyDecode = bs58.decode(secretKey);
            const payer = Keypair.fromSecretKey(secretKeyDecode);

            const mintpubKey = new PublicKey(mintAddress);

            const ata = await getOrCreateAssociatedTokenAccount(
                this.connection,
                payer,
                mintpubKey,
                payer.publicKey
            );
            console.log("Associated Token Account", ata);

            const account = {
                address: ata.address.toBase58(),
                mint: ata.mint.toBase58(),
                owner: ata.owner.toBase58(),
                amount: ata.amount.toString(),
                delegate: ata.delegate ? ata.delegate.toBase58() : null,
                delegatedAmount: ata.delegatedAmount.toString(),
                isInitialized: ata.isInitialized,
                isFrozen: ata.isFrozen,
                rentExemptReserve: ata.rentExemptReserve ? ata.rentExemptReserve.toString() : null,
                closeAuthority: ata.closeAuthority ? ata.closeAuthority.toBase58() : null,
            }

            return { associatedTokenAccount: account };

        } catch (error) {
            console.error("Error creating associated token account:", error);
            throw new BadRequestException(error.transactionMessage || 'Failed to create associated token account');
        }
    }

    async transferTokens(
        secretKey: string, 
        fromTokenAccount: string, 
        toTokenAccount: string, 
        amount: number, 
        mintAccount: string) {
        try {
            const secretKeyDecode = bs58.decode(secretKey);
            const payer = Keypair.fromSecretKey(secretKeyDecode);

            const fromTokenAccountPubKey = new PublicKey(fromTokenAccount);
            const mintpubKey = new PublicKey(mintAccount);
            const toTokenAccountPubKey = new PublicKey(toTokenAccount);

            const decimais = (await this.getMintInfo(mintAccount)).mintInfo.decimals;

            const tx = await transferChecked(
                this.connection,
                payer,
                fromTokenAccountPubKey,
                mintpubKey,
                toTokenAccountPubKey,
                payer,
                amount,
                decimais
            );

            console.log("Transfer Token:", tx);
            return { transactionSignature: tx };

        } catch (error) {
            console.error("Error Transfer tokens:", error);
            throw new BadRequestException(error.transactionMessage || 'Failed to transfer tokens');
        }
    }

}
