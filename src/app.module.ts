import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventService } from './event/event.service';
import { EventModule } from './event/event.module';

@Module({
  imports: [EventModule],
  controllers: [AppController],
  providers: [AppService, EventService],
})
export class AppModule {}
