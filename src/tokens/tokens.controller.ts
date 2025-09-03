import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
    constructor(private readonly tokensService: TokensService) { }

    @Post('mint-account')
    async createMint(
        @Body('secretKey') secretKey: string,
        @Body('decimals') decimals: number,
    ) {
        return this.tokensService.createMintAccount(secretKey, decimals);
    }

    @Get('mint/:mintAddress')
    async getMintInfo(@Param('mintAddress') mintAddress: string) {
        return this.tokensService.getMintInfo(mintAddress);
    }

    @Post('mint')
    async mint(
        @Body('secretKey') secretKey: string,
        @Body('mintAddress') mintAddress: string,
        @Body('destinationAddress') destinationAddress: string,
        @Body('amount') amount: number,
        @Body('decimals') decimals: number,
    ) {
        return this.tokensService.mint(secretKey, mintAddress, destinationAddress, amount, decimals);
    }

    @Post('associated-account')
    async createAssociatedTokenAccount(
        @Body('secretKey') secretKey: string,
        @Body('mintAddress') mintAddress: string,
    ) {
        return this.tokensService.createAssociatedTokenAccount(secretKey, mintAddress);
    }
}
