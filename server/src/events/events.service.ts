import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Event, EventStatus } from './entities/event.entity';
import { Setting } from './entities/setting.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { OptioService } from '../optio/optio.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
    private optioService: OptioService,
    private dataSource: DataSource,
  ) {
    // Initialize settings if they don't exist
    this.initializeSettings();
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      order: { occurredAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Event> {
    return this.eventRepository.findOneBy({ id });
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create({
      ...createEventDto,
      status: EventStatus.PENDING,
      createdAt: new Date(),
    });
    
    const savedEvent = await this.eventRepository.save(event);
    
    // Check if Optio sync is enabled and send to Optio
    const optioSyncEnabled = await this.getSetting('optioSyncEnabled', 'true');
    
    if (optioSyncEnabled === 'true') {
      try {
        const response = await this.optioService.sendEvent({
          eventId: event.eventId,
          type: event.type,
          occurredAt: event.occurredAt,
          payload: JSON.parse(event.payload),
        });
        
        // Update event with response
        savedEvent.status = EventStatus.SENT;
        savedEvent.optioResponse = JSON.stringify(response);
        await this.eventRepository.save(savedEvent);
        
        // Update last response
        await this.updateSetting('lastApiRequest', JSON.stringify({
          eventId: event.eventId,
          type: event.type,
          occurredAt: event.occurredAt,
          payload: JSON.parse(event.payload),
        }));
        await this.updateSetting('lastApiResponse', JSON.stringify(response));
      } catch (error) {
        console.error('Error sending event to Optio:', error);
        
        // Update event with error
        savedEvent.status = EventStatus.FAILED;
        savedEvent.optioResponse = JSON.stringify({ error: error.message });
        await this.eventRepository.save(savedEvent);
        
        // Update last response
        await this.updateSetting('lastApiRequest', JSON.stringify({
          eventId: event.eventId,
          type: event.type,
          occurredAt: event.occurredAt,
          payload: JSON.parse(event.payload),
        }));
        await this.updateSetting('lastApiResponse', JSON.stringify({ error: error.message }));
      }
    }
    
    return savedEvent;
  }

  async getLastApiResponse(): Promise<{ request: string, response: string }> {
    const request = await this.getSetting('lastApiRequest', '');
    const response = await this.getSetting('lastApiResponse', '');
    
    return { request, response };
  }

  async getSettings(): Promise<{ [key: string]: string }> {
    const settings = await this.settingRepository.find();
    
    // Convert to key-value object
    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
  }

  async getSetting(key: string, defaultValue: string = ''): Promise<string> {
    const setting = await this.settingRepository.findOneBy({ key });
    return setting ? setting.value : defaultValue;
  }

  async updateSetting(key: string, value: string): Promise<{ key: string, value: string }> {
    let setting = await this.settingRepository.findOneBy({ key });
    
    if (setting) {
      setting.value = value;
      setting.updatedAt = new Date();
    } else {
      setting = this.settingRepository.create({
        key,
        value,
        updatedAt: new Date(),
      });
    }
    
    await this.settingRepository.save(setting);
    
    return { key, value };
  }

  async resetDatabase(): Promise<void> {
    // Use transaction to ensure all or nothing
    await this.dataSource.transaction(async (manager: EntityManager) => {
      // Clear all data from tables
      await manager.query('DELETE FROM events');
      await manager.query('DELETE FROM loan_payments');
      await manager.query('DELETE FROM loans');
      await manager.query('DELETE FROM scheduled_payments');
      await manager.query('DELETE FROM transactions');
      await manager.query('DELETE FROM accounts');
      
      // Reset auto-increment counters
      await manager.query('DELETE FROM sqlite_sequence');
      
      // Update settings
      await this.updateSetting('lastDbReset', new Date().toISOString());
    });
  }

  private async initializeSettings(): Promise<void> {
    // Default settings
    const defaultSettings = {
      optioSyncEnabled: 'true',
      darkMode: 'false',
      dbVersion: '1.0.0',
    };
    
    for (const [key, value] of Object.entries(defaultSettings)) {
      const setting = await this.settingRepository.findOneBy({ key });
      
      if (!setting) {
        await this.updateSetting(key, value);
      }
    }
  }
}
