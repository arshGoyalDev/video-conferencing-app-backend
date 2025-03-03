import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private jwt: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwt;

    if (token) {
      const verify = await this.jwt.verifyAsync(token);

      req["user"] = {
        userId: verify.userId,
        email: verify.email,
      };

      next();
    } else throw new UnauthorizedException("You are not authorized");
  }
}
