import { Body, Controller, Post, Req } from '@nestjs/common';

import { MeetService } from './meet.service';

import { NewMeetDto } from './dto';

import { Request } from 'express';

@Controller('meet')
export class MeetController {
  constructor (private meetService: MeetService) {};

  @Post("new-meet")
  newMeet(@Body() newMeetDto: NewMeetDto, @Req() req: Request) {
    return this.meetService.newMeet(newMeetDto, req); 
  }
}
