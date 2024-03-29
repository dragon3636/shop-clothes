import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PublicFile from './entities/publicFile.entity';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([PublicFile]),
    ConfigModule
  ],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule { }
