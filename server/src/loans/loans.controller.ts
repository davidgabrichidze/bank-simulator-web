import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { LoanPayment } from './entities/loan-payment.entity';
import { 
  LoanApplicationDto, 
  PayLoanInstallmentDto, 
  MarkInstallmentAsMissedDto 
} from './dto/loan.dto';

@ApiTags('loans')
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  @ApiOperation({ summary: 'Get all loans' })
  @ApiResponse({ status: 200, description: 'Return all loans', type: [Loan] })
  async findAll(): Promise<Loan[]> {
    return this.loansService.findAll();
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Get loans for an account' })
  @ApiResponse({ status: 200, description: 'Return account loans', type: [Loan] })
  async findByAccount(@Param('accountId') accountId: number): Promise<Loan[]> {
    return this.loansService.findByAccount(accountId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get loan by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return loan by ID', type: Loan })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  async findOne(@Param('id') id: number): Promise<Loan> {
    const loan = await this.loansService.findOne(id);
    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }
    return loan;
  }

  @Post()
  @ApiOperation({ summary: 'Apply for a loan' })
  @ApiResponse({ status: 201, description: 'Loan application processed', type: Loan })
  async apply(@Body() loanApplicationDto: LoanApplicationDto): Promise<Loan> {
    try {
      return await this.loansService.applyForLoan(loanApplicationDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id/payments')
  @ApiOperation({ summary: 'Get payments for a loan' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return loan payments', type: [LoanPayment] })
  @ApiResponse({ status: 404, description: 'Loan not found' })
  async getLoanPayments(@Param('id') id: number): Promise<LoanPayment[]> {
    const loan = await this.loansService.findOne(id);
    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }
    return this.loansService.getLoanPayments(id);
  }

  @Post('payments/pay')
  @ApiOperation({ summary: 'Pay a loan installment' })
  @ApiResponse({ status: 200, description: 'Payment processed successfully', type: LoanPayment })
  async payInstallment(@Body() paymentDto: PayLoanInstallmentDto): Promise<LoanPayment> {
    try {
      return await this.loansService.payLoanInstallment(paymentDto);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('payments/miss')
  @ApiOperation({ summary: 'Mark a loan installment as missed' })
  @ApiResponse({ status: 200, description: 'Installment marked as missed', type: LoanPayment })
  async markAsMissed(@Body() missedDto: MarkInstallmentAsMissedDto): Promise<LoanPayment> {
    try {
      return await this.loansService.markInstallmentAsMissed(missedDto);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }
}
