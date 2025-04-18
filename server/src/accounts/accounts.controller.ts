import { Controller, Get, Post, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiResponse({ status: 200, description: 'Return all accounts', type: [Account] })
  async findAll(): Promise<Account[]> {
    return this.accountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return account by ID', type: Account })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async findOne(@Param('id') id: number): Promise<Account> {
    const account = await this.accountsService.findOne(id);
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully', type: Account })
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.create(createAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Close an account' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Account closed successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async close(@Param('id') id: number): Promise<void> {
    const account = await this.accountsService.findOne(id);
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return this.accountsService.close(id);
  }
}
