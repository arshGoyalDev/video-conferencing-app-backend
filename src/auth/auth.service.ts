import { ForbiddenException, Injectable } from "@nestjs/common";

import { SignUpDto } from "./dto";
import { Response } from "express";

import * as argon from "argon2";

import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async createToken(userId: number, email: string) {
    return await this.jwt.signAsync({
      userId,
      email,
    });
  }

  async signup(signupDto: SignUpDto, res: Response) {
    try {
      const passwordHash = await argon.hash(signupDto.password);

      const user = await this.prisma.user.create({
        data: {
          email: signupDto.email,
          password: passwordHash,
          firstName: signupDto.firstName,
          lastName: signupDto.lastName,
        },
        select: {
          userId: true,
          email: true,
          firstName: true,
          lastName: true,
          profilePic: true,
          guestStatus: true,
        },
      });

      res.cookie("jwt", this.createToken(user.userId, user.email), {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
      });

      return { user: user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Credentials already taken");
        }
      }    }
  }
}
