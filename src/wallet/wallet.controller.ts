import { Controller, Get, Post, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('generate-wallet')
  createWallet() {
    return this.walletService.generateWallet();
  }

  @Post('create-wallet/:payerSecretKey')
  async createWalletWithPayer(@Param('payerSecretKey') payerSecretKey: string) {
    return await this.walletService.createWallet(payerSecretKey);
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
