import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

// Import all entity classes
import { Account } from '../accounts/entities/account.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { ScheduledPayment } from '../transactions/entities/scheduled-payment.entity';
import { Loan } from '../loans/entities/loan.entity';
import { LoanPayment } from '../loans/entities/loan-payment.entity';
import { Event } from '../events/entities/event.entity';
import { Setting } from '../events/entities/setting.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: process.env.NODE_ENV === 'test' ? ':memory:' : 'optio-bank-sim.db',
  entities: [
    Account,
    Transaction,
    ScheduledPayment,
    Loan,
    LoanPayment,
    Event,
    Setting,
  ],
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV !== 'production',
  autoLoadEntities: true,
};
