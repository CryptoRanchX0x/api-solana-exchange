import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { ProviderModule } from '../provider/provider.module';

@Module({
  providers: [TokensService],
  controllers: [TokensController],
  imports: [ProviderModule],
})
export class TokensModule {}
