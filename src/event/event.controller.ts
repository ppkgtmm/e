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

  @Get('by/date')
  async getEventsByDate(@Body() body: GetEventDTO) {
    return await this.eventServive.getEventsByDate(body);
  }

  @Get('by/week')
  async getEventsByMonth(@Body() body: GetEventDTO) {
    return await this.eventServive.getEventsByWeek(body);
  }
}
