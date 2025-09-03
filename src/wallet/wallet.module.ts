import { Module } from '@nestjs/common';

import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { ProviderModule } from '../provider/provider.module';

@Module({
  providers: [WalletService],
  controllers: [WalletController],
  imports: [ProviderModule],
})
export class WalletModule {}
