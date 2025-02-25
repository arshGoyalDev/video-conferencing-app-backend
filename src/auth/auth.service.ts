import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { LoginDto, SignUpDto, UpdateDetailsDto } from "./dto";
import { Request, Response } from "express";

import * as argon from "argon2";

import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

import { existsSync, unlinkSync } from "fs";
import { join } from "path";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async signup(signupDto: SignUpDto, res: Response) {
    const passwordHash = await argon.hash(signupDto.password);

    const user = await this.prisma.user
      .create({
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
      })
      .catch(() => {
        throw new ForbiddenException("Credentials already taken");
      });

    res.cookie(
      "jwt",
      await this.jwt.signAsync({
        userId: user.userId,
        email: user.email,
      })
    );

    return { user };
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.prisma.user
      .findUniqueOrThrow({
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
      })
      .catch(() => {
        throw new NotFoundException("User with the given email not found");
      });

    const auth = await argon.verify(user.password, loginDto.password);

    if (!auth) {
      throw new UnauthorizedException("Password Incorrect");
    }

    res.cookie(
      "jwt",
      await this.jwt.signAsync({
        userId: user.userId,
        email: user.email,
      })
    );

    return {
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
        guestStatus: user.guestStatus,
      },
    };
  }

  async userInfo(req: Request) {
    const user = await this.prisma.user
      .findUniqueOrThrow({
        where: {
          email: req["user"].email,
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
      })
      .catch(() => {
        throw new NotFoundException("User with the given email not found");
      });

    return { user };
  }

  async updateDetails(req: Request, updateDetailsDto: UpdateDetailsDto) {
    try {
      const user = await this.prisma.user.updateManyAndReturn({
        where: {
          email: req["user"].email,
        },
        data: {
          firstName: updateDetailsDto.firstName,
          lastName: updateDetailsDto.lastName,
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

      return { user };
    } catch (error) {
      throw new InternalServerErrorException("Internal Server Error");
    }
  }

  async logout(res: Response) {
    try {
      res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "none" });

      return { logoutMsg: "Logout Successful" };
    } catch (error) {
      throw new InternalServerErrorException("Internal Server Error");
    }
  }

  //   async deleteUser(req: Request, res: Response) {
  //     try {
  //       await this.prisma.user.delete({
  //         where: { email: req.user.email },
  //       });

  //       res.cookie("jwt", "", { maxAge: 1, sameSite: "none", secure: true });
  //     } catch (error) {
  //       throw new InternalServerErrorException("Internal Server Error");
  //     }
  //   }

  async addProfilePic(req: Request, profilePic: Express.Multer.File) {
    try {
      console.log(profilePic);
      const user = await this.prisma.user.update({
        where: {
          email: req["user"].email,
        },
        data: {
          profilePic: `/auth/${profilePic.filename}`,
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

      return { user };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Internal Server Error");
    }
  }

  async removeProfilePic(req: Request) {
    try {
      const userData = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: req["user"].email,
        },
        select: {
          profilePic: true,
        },
      });

      const filePath = join(
        process.cwd(),
        "uploads/auth",
        userData.profilePic.split("/").at(-1)
      );

      if (!existsSync(filePath)) {
        throw new HttpException("Profile Pic not found", HttpStatus.NOT_FOUND);
      }

      unlinkSync(filePath);

      const user = await this.prisma.user.update({
        where: {
          email: req["user"].email,
        },
        data: {
          profilePic: "",
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

      return { user };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Internal Server Error");
    }
  }
}
