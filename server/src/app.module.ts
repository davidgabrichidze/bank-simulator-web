import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { databaseConfig } from './config/database.config';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { LoansModule } from './loans/loans.module';
import { EventsModule } from './events/events.module';
import { OptioModule } from './optio/optio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ScheduleModule.forRoot(),
    AccountsModule,
    TransactionsModule,
    LoansModule,
    EventsModule,
    OptioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
