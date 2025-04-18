import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { OptioEventPayload } from './interfaces/optio-event.interface';

@Injectable()
export class OptioService {
  private readonly logger = new Logger(OptioService.name);
  private readonly optioEndpoint: string;
  private readonly optioToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.optioEndpoint = 'https://api.optio.com/v1/banking-events';
    this.optioToken = this.configService.get<string>('OPTIO_TOKEN') || 'mock_token';
  }

  async sendEvent(event: OptioEventPayload): Promise<any> {
    try {
      // In a real environment, we would send the event to Optio
      // For simulation, we'll just log it and return a mock response
      this.logger.log(`Sending event to Optio: ${JSON.stringify(event)}`);

      // Check if we're in a real environment with a real token
      if (this.optioToken !== 'mock_token') {
        // Real API call
        const response = await lastValueFrom(
          this.httpService.post(
            this.optioEndpoint,
            event,
            {
              headers: {
                'Authorization': `Bearer ${this.optioToken}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );
        
        return response.data;
      }

      // Mock response for simulation
      return {
        success: true,
        eventId: event.eventId,
        receivedAt: new Date().toISOString(),
        status: 'accepted',
      };
    } catch (error) {
      this.logger.error(`Error sending event to Optio: ${error.message}`);
      throw error;
    }
  }

  async getStatus(): Promise<{ enabled: boolean, lastSync: string | null }> {
    // This would normally check the API connection status
    // For simulation, we'll just return a mock status
    return {
      enabled: true,
      lastSync: new Date().toISOString(),
    };
  }
}
