import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import User from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { FilesModule } from '@/files/files.module';
import { PrivateFileModule } from '@/private-file/private-file.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FilesModule, PrivateFileModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
