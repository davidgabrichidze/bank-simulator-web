import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, Max, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoanApplicationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the account to associate with the loan',
    example: 1,
  })
  accountId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(100)
  @ApiProperty({
    description: 'Amount of the loan',
    example: 10000.00,
  })
  amount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Currency of the loan',
    example: 'USD',
    default: 'USD',
  })
  currency?: string = 'USD';

  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  @Max(30)
  @ApiProperty({
    description: 'Annual interest rate (%)',
    example: 5.5,
  })
  interestRate: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Loan term in months',
    example: 36,
  })
  term: number;

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({
    description: 'Loan start date (ISO-8601 format)',
    example: '2023-06-01T00:00:00.000Z',
  })
  startDate: string;
}

export class PayLoanInstallmentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the loan',
    example: 1,
  })
  loanId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the payment',
    example: 2,
  })
  paymentId: number;

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({
    description: 'Payment date (ISO-8601 format)',
    example: '2023-06-15T00:00:00.000Z',
  })
  date: string;
}

export class MarkInstallmentAsMissedDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the loan',
    example: 1,
  })
  loanId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'ID of the payment',
    example: 2,
  })
  paymentId: number;
}
