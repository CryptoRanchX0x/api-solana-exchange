import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('generate-wallet')
  createWallet() {
    return this.walletService.generateWallet();
  }

  @Post('create-wallet')
  async createWalletOnChain(@Body('secretKey') secretKey: string) {
    return await this.walletService.createWallet(secretKey);
  }

  @Get('airdrop/:address')
  async requestAirdrop(@Param('address') address: string) {
    const amount = 1;
    return await this.walletService.requestAirdrop(address, amount);
  }

  @Get('account-info/:address')
  async getAccountInfo(@Param('address') address: string) {
    return await this.walletService.getAccountInfo(address);
  }

  @Get('rent-account/:address')
  async getRentAccount(@Param('address') address: string) {
    return await this.walletService.getRentAccount(address);
  }
}
