import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventDTO, GetEventDTO } from '../shared/dtos';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventServive: EventService) {}
  @Post()
  async addEvent(@Body() body: EventDTO) {
    return await this.eventServive.createEvent(body);
  }

  // @Get()
  // async getEventsByDate(@Body() body: GetEventDTO) {
  //   return await this.eventServive.getEventsByDate(body);
  // }

  // @Get()
  // async getEventsByMonth() {}
}
