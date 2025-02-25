import { Module } from "@nestjs/common";

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from "./prisma/prisma.module";
import { MeetModule } from './meet/meet.module';

@Module({
  imports: [AuthModule, PrismaModule, MeetModule],
})

export class AppModule {}
