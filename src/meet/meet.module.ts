import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";

import { MeetController } from "./meet.controller";
import { MeetService } from "./meet.service";
import { MeetMiddleware } from "./meet.middleware";

@Module({
  controllers: [MeetController],
  providers: [MeetService],
})
export class MeetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MeetMiddleware).forRoutes(MeetController);
  }
}
