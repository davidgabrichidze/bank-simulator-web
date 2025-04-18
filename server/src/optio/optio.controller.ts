import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OptioService } from './optio.service';
import { ToggleSyncDto } from './dto/toggle-sync.dto';

@ApiTags('optio')
@Controller('optio')
export class OptioController {
  constructor(private readonly optioService: OptioService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get Optio sync status' })
  @ApiResponse({ status: 200, description: 'Return Optio sync status' })
  async getStatus(): Promise<{ enabled: boolean, lastSync: string | null }> {
    return this.optioService.getStatus();
  }

  @Post('toggle-sync')
  @ApiOperation({ summary: 'Toggle Optio sync on/off' })
  @ApiResponse({ status: 200, description: 'Optio sync toggled' })
  async toggleSync(@Body() toggleSyncDto: ToggleSyncDto): Promise<{ enabled: boolean }> {
    // This would normally update a configuration in the database
    // For simulation, we'll just return the provided value
    return { enabled: toggleSyncDto.enabled };
  }
}
