import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Req, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/RegisterDto.dto';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';
import { Response } from 'express';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { UsersService } from 'src/users/users.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UsersService
  ) { }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }


  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }

  @Get(":id")
  @UseGuards(JwtAuthenticationGuard)
  async detailUser(@Param('id') id: number) {
    return this.userService.getById(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }
}