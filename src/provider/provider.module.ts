import { Module } from '@nestjs/common';
import { Provider } from './provider';

@Module({
  providers: [Provider],
  exports: [Provider],
})
export class ProviderModule {}
