import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { WalletService } from './wallet/wallet.service';
import { WalletController } from './wallet/wallet.controller';
import { TransactionModule } from './transaction/transaction.module';
import { TokensModule } from './tokens/tokens.module';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [WalletModule, TransactionModule, TokensModule, ProviderModule],
  controllers: [WalletController],
  providers: [AppService, WalletService],
})
export class AppModule {}
