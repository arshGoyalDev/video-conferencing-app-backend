import { Body, Controller, Post, Res } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { LoginDto, SignUpDto } from "./dto";
import { Response } from "express";

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
}
