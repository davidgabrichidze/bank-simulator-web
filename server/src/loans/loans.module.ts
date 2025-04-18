import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { LoanPayment } from './entities/loan-payment.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loan, LoanPayment]),
    AccountsModule,
    EventsModule,
  ],
  controllers: [LoansController],
  providers: [LoansService],
  exports: [LoansService],
})
export class LoansModule {}
