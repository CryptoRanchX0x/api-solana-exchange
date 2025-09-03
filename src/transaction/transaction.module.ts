import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ProviderModule } from '../provider/provider.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [ProviderModule],
})
export class TransactionModule {}
