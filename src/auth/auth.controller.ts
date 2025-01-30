import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { LoginDto, SignUpDto } from "./dto";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("sign-up")
  signup(
    @Body() signupDto: SignUpDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.signup(signupDto, res);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Get("user-info")
  userInfo(@Req() req:Request) {
    return this.authService.userInfo(req);
  }
}
