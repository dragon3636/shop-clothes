import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PrivateFile from './privateFile.entity';
import { PrivateFileService } from './private-file.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrivateFile]),
    ConfigModule,
  ],
  providers: [PrivateFileService],
  exports: [PrivateFileService]
})
export class PrivateFileModule { }
