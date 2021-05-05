import { Controller, Post } from '@nestjs/common';

@Controller('event')
export class EventController {
  @Post()
  async addEvent() {}
}
