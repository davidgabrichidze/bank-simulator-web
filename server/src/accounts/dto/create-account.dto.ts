import { IsNotEmpty, IsString, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the account',
    example: 'Personal Checking',
  })
  name: string;

  @IsNotEmpty()
  @IsEnum(AccountType)
  @ApiProperty({
    description: 'The type of the account',
    enum: AccountType,
    example: 'personal',
  })
  type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The currency of the account',
    example: 'USD',
    default: 'USD',
  })
  currency?: string = 'USD';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'The initial balance of the account',
    example: 1000,
    default: 0,
  })
  balance?: number = 0;
}
