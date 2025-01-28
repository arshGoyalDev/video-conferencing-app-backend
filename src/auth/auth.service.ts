import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";

import { LoginDto, SignUpDto } from "./dto";
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
      }
    }
  }

  async login(loginDto: LoginDto, res: Response) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: loginDto.email,
        },
        select: {
          userId: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          profilePic: true,
          guestStatus: true,
        },
      });

      const auth = await argon.verify(user.password, loginDto.password);

      if (!auth) {
        throw new UnauthorizedException("Password Incorrect");
      }

      res.cookie("jwt", this.createToken(user.userId, user.email), {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "none",
      });

      return { user: {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
        guestStatus: user.guestStatus,
      } };
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException("User with the given email not found");
      } else if (error.response.statusCode === 401) {
        throw new UnauthorizedException("Password Incorrect");
      }
    }
  }
}
