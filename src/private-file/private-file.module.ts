import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PrivateFileService } from './private-file.service';
import PrivateFile from './privateFile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrivateFile]), ConfigModule],
  providers: [PrivateFileService],
  exports: [PrivateFileService],
})
export class PrivateFileModule {}
