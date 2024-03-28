import { ClassSerializerInterceptor, Controller, Delete, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, ParseFilePipeBuilder, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Express } from 'express';
import { UsersService } from './users.service';
import { FindOneParams } from 'src/utils/findOneParams';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import RequestWithUser from 'src/authentication/requestWithUser.interface';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {

  }
  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  async register(@Param() { id }: FindOneParams) {
    return this.usersService.getById(+id);
  }

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile(new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: '.(png|jpeg|jpg)'
      })
      .addMaxSizeValidator({
        maxSize: 1024 * 1024
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),)
    file: Express.Multer.File) {
    return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
  }
  @Delete("avatar")
  @UseGuards(JwtAuthenticationGuard)
  async removeAvatar(@Req() request: RequestWithUser,) {
    console.log("user id", request.user);
    return this.usersService.deleteAvatar(request.user.id);
  }
}
