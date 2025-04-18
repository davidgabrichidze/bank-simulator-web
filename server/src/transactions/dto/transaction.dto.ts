import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, Min, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';
import { PaymentFrequency } from '../entities/scheduled-payment.entity';

export class DepositDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the account to deposit into',
    example: 1,
  })
  accountId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({
    description: 'Amount to deposit',
    example: 100.00,
  })
  amount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Currency of the deposit',
    example: 'USD',
    default: 'USD',
  })
  currency?: string = 'USD';

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional description of the deposit',
    example: 'Salary deposit',
    required: false,
  })
  description?: string;
}

export class WithdrawalDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the account to withdraw from',
    example: 1,
  })
  accountId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({
    description: 'Amount to withdraw',
    example: 50.00,
  })
  amount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Currency of the withdrawal',
    example: 'USD',
    default: 'USD',
  })
  currency?: string = 'USD';

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional description of the withdrawal',
    example: 'ATM withdrawal',
    required: false,
  })
  description?: string;
}

export class TransferDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the source account',
    example: 1,
  })
  sourceAccountId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the target account',
    example: 2,
  })
  targetAccountId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({
    description: 'Amount to transfer',
    example: 75.00,
  })
  amount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Currency of the transfer',
    example: 'USD',
    default: 'USD',
  })
  currency?: string = 'USD';

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional description of the transfer',
    example: 'Rent payment',
    required: false,
  })
  description?: string;
}

export class ExternalTransferDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the source account',
    example: 1,
  })
  sourceAccountId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the beneficiary',
    example: 'John Doe',
  })
  beneficiaryName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Account number of the beneficiary',
    example: 'GB29NWBK60161331926819',
  })
  beneficiaryAccount: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Name of the beneficiary bank',
    example: 'Bank of London',
  })
  beneficiaryBank: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'SWIFT code of the beneficiary bank',
    example: 'NWBKGB2L',
    required: false,
  })
  beneficiarySwiftCode?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({
    description: 'Amount to transfer',
    example: 150.00,
  })
  amount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Currency of the transfer',
    example: 'USD',
    default: 'USD',
  })
  currency?: string = 'USD';

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional description of the transfer',
    example: 'International payment',
    required: false,
  })
  description?: string;
}

export class ScheduledPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the source account',
    example: 1,
  })
  accountId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the target account (if internal transfer)',
    example: 2,
    required: false,
  })
  targetAccountId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  @ApiProperty({
    description: 'Amount to transfer',
    example: 100.00,
  })
  amount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Currency of the payment',
    example: 'USD',
    default: 'USD',
  })
  currency?: string = 'USD';

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Optional description of the payment',
    example: 'Monthly subscription',
    required: false,
  })
  description?: string;

  @IsNotEmpty()
  @IsEnum(PaymentFrequency)
  @ApiProperty({
    description: 'Frequency of the payment',
    enum: PaymentFrequency,
    example: PaymentFrequency.MONTHLY,
  })
  frequency: PaymentFrequency;

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({
    description: 'Date of the next payment (ISO-8601 format)',
    example: '2023-06-01T00:00:00.000Z',
  })
  nextPaymentDate: string;

  @IsOptional()
  @IsISO8601()
  @ApiProperty({
    description: 'End date for recurring payments (ISO-8601 format)',
    example: '2023-12-01T00:00:00.000Z',
    required: false,
  })
  endDate?: string;
}
