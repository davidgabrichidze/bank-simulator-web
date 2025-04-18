import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OptioService } from './optio.service';
import { OptioController } from './optio.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [OptioController],
  providers: [OptioService],
  exports: [OptioService],
})
export class OptioModule {}
