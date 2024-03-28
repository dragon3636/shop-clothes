import { ClassSerializerInterceptor, Controller, Get, Param, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { FindOneParams } from 'src/utils/findOneParams';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {

  }
  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  async register(@Param() { id }: FindOneParams) {
    return this.userService.getById(+id);
  }
}
