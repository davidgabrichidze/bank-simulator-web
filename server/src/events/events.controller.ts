import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { SettingDto } from './dto/setting.dto';

@ApiTags('events')
@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('events')
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'Return all events', type: [Event] })
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 200, description: 'Return event by ID', type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: number): Promise<Event> {
    const event = await this.eventsService.findOne(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  @Get('events/last-response')
  @ApiOperation({ summary: 'Get the last API request and response' })
  @ApiResponse({ status: 200, description: 'Return last API request and response' })
  async getLastApiResponse(): Promise<{ request: string, response: string }> {
    return this.eventsService.getLastApiResponse();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, description: 'Return all settings' })
  async getSettings(): Promise<{ [key: string]: string }> {
    return this.eventsService.getSettings();
  }

  @Post('settings')
  @ApiOperation({ summary: 'Update a setting' })
  @ApiResponse({ status: 200, description: 'Setting updated successfully' })
  async updateSetting(@Body() settingDto: SettingDto): Promise<{ key: string, value: string }> {
    return this.eventsService.updateSetting(settingDto.key, settingDto.value);
  }

  @Post('settings/reset')
  @ApiOperation({ summary: 'Reset the database' })
  @ApiResponse({ status: 200, description: 'Database reset successfully' })
  async resetDatabase(): Promise<{ success: boolean }> {
    await this.eventsService.resetDatabase();
    return { success: true };
  }
}
