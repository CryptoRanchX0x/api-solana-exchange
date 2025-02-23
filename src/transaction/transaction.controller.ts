import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create-transaction')
  async createTransaction(
    @Body('from') from: string,
    @Body('to') to: string,
    @Body('amount') amount: number,
  ) {
    return this.transactionService.createTransaction(from, to, amount);
  }

  @Post('sign-transaction')
  signTransaction(
    @Body('rawTransaction') rawTransaction: string,
    @Body('secretKey') secretKey: string,
  ) {
    return this.transactionService.signTransaction(rawTransaction, secretKey);
  }

  @Post('send-transaction')
  async sendTransaction(@Body('rawTransactionSigned') rawTransaction: string) {
    return this.transactionService.sendTransaction(rawTransaction);
  }
}
