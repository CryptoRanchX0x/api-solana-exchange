import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { WalletService } from './wallet/wallet.service';
import { WalletController } from './wallet/wallet.controller';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [WalletModule, TransactionModule],
  controllers: [AppController, WalletController],
  providers: [AppService, WalletService],
})
export class AppModule {}
