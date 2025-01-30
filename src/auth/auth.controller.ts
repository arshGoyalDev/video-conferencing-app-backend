import { Body, Controller, Delete, Get, Post, Req, Res } from "@nestjs/common";

import { AuthService } from "./auth.service";

import { LoginDto, SignUpDto, UpdateDetailsDto } from "./dto";
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
  userInfo(@Req() req: Request) {
    return this.authService.userInfo(req);
  }

  @Post("update-details")
  updateDetails(
    @Req() req: Request,
    @Body() updateDetailsDto: UpdateDetailsDto
  ) {
    return this.authService.updateDetails(req, updateDetailsDto);
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Delete("delete-user")
  deleteUser(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    this.authService.deleteUser(req, res);
  }
}
