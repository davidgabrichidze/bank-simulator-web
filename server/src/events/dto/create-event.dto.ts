import { IsNotEmpty, IsString, IsEnum, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventType } from '../entities/event.entity';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'UUID for the event',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  eventId: string;

  @IsNotEmpty()
  @IsEnum(EventType)
  @ApiProperty({
    description: 'Type of event',
    enum: EventType,
    example: EventType.DEPOSIT_MADE,
  })
  type: string;

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({
    description: 'When the event occurred (ISO-8601 format)',
    example: '2023-05-15T14:32:45.000Z',
  })
  occurredAt: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Event payload as JSON string',
    example: '{"accountId":"1234-5678-9000","amount":150.00,"currency":"USD","channel":"web-simulator"}',
  })
  payload: string;
}
