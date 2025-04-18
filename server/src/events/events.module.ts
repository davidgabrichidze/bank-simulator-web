import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { Setting } from './entities/setting.entity';
import { OptioModule } from '../optio/optio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Setting]),
    OptioModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
