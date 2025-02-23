import { Controller, Get, Post, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create-wallet')
  createWallet() {
    return this.walletService.createWallet();
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
}
