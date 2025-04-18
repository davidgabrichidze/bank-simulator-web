import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { ScheduledPayment } from './entities/scheduled-payment.entity';
import { 
  DepositDto, 
  WithdrawalDto, 
  TransferDto, 
  ExternalTransferDto,
  ScheduledPaymentDto
} from './dto/transaction.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'Return all transactions', type: [Transaction] })
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Get transactions for an account' })
  @ApiResponse({ status: 200, description: 'Return account transactions', type: [Transaction] })
  async findByAccount(@Param('accountId') accountId: number): Promise<Transaction[]> {
    return this.transactionsService.findByAccount(accountId);
  }

  @Post('deposit')
  @ApiOperation({ summary: 'Make a deposit' })
  @ApiResponse({ status: 201, description: 'Deposit successful', type: Transaction })
  async deposit(@Body() depositDto: DepositDto): Promise<Transaction> {
    try {
      return await this.transactionsService.deposit(depositDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Make a withdrawal' })
  @ApiResponse({ status: 201, description: 'Withdrawal successful', type: Transaction })
  async withdraw(@Body() withdrawalDto: WithdrawalDto): Promise<Transaction> {
    try {
      return await this.transactionsService.withdraw(withdrawalDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Make an internal transfer' })
  @ApiResponse({ status: 201, description: 'Transfer successful', type: Transaction })
  async transfer(@Body() transferDto: TransferDto): Promise<Transaction> {
    try {
      return await this.transactionsService.transfer(transferDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('external-transfer')
  @ApiOperation({ summary: 'Make an external transfer' })
  @ApiResponse({ status: 201, description: 'External transfer successful', type: Transaction })
  async externalTransfer(@Body() transferDto: ExternalTransferDto): Promise<Transaction> {
    try {
      return await this.transactionsService.externalTransfer(transferDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Scheduled Payments
  @Get('scheduled-payments')
  @ApiOperation({ summary: 'Get all scheduled payments' })
  @ApiResponse({ status: 200, description: 'Return all scheduled payments', type: [ScheduledPayment] })
  async findAllScheduledPayments(): Promise<ScheduledPayment[]> {
    return this.transactionsService.findAllScheduledPayments();
  }

  @Get('scheduled-payments/account/:accountId')
  @ApiOperation({ summary: 'Get scheduled payments for an account' })
  @ApiResponse({ status: 200, description: 'Return account scheduled payments', type: [ScheduledPayment] })
  async findScheduledPaymentsByAccount(@Param('accountId') accountId: number): Promise<ScheduledPayment[]> {
    return this.transactionsService.findScheduledPaymentsByAccount(accountId);
  }

  @Post('scheduled-payments')
  @ApiOperation({ summary: 'Create a scheduled payment' })
  @ApiResponse({ status: 201, description: 'Scheduled payment created', type: ScheduledPayment })
  async createScheduledPayment(@Body() scheduledPaymentDto: ScheduledPaymentDto): Promise<ScheduledPayment> {
    try {
      return await this.transactionsService.createScheduledPayment(scheduledPaymentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('scheduled-payments/:id/cancel')
  @ApiOperation({ summary: 'Cancel a scheduled payment' })
  @ApiResponse({ status: 200, description: 'Scheduled payment cancelled' })
  async cancelScheduledPayment(@Param('id') id: number): Promise<void> {
    try {
      return await this.transactionsService.cancelScheduledPayment(id);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}
