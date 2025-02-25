import { ForbiddenException, Injectable } from "@nestjs/common";

import { PrismaService } from "src/prisma/prisma.service";

import { NewMeetDto } from "./dto"
;
import { Request } from "express";

@Injectable()
export class MeetService {
  constructor(private prisma: PrismaService) {}

  async newMeet(newMeetDto: NewMeetDto, req: Request) {
    const meet = await this.prisma.meet.create({
      data: {
        meetId: newMeetDto.meetId,
        allowVideo: newMeetDto.allowVideo,
        allowMic: newMeetDto.allowMic,
        anyoneCanJoin: newMeetDto.anyoneCanJoin,
        
        meetAdminId: req["user"].userId,
      }
    }).catch(() => {
      throw new ForbiddenException("Credentials already taken");
    });

    return meet
  }
}
