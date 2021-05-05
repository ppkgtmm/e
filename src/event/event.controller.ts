import { Body, Controller, Post } from '@nestjs/common';
import { EventDTO } from '../shared/dtos';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventServive: EventService) {}
  @Post()
  async addEvent(@Body() body: EventDTO) {
    return await this.eventServive.createEvent(body);
  }
}
