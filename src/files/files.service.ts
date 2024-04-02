import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import PublicFile from './entities/publicFile.entity';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFile) private publicFilesRepository: Repository<PublicFile>,
    private readonly configService: ConfigService) { }
  async uploadPublicFile(dataBuffer: Buffer, filename: string, folder?: string) {
    const s3 = new S3();
    const extension = filename.split('.').reverse()[0];
    const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: dataBuffer,
      Key: `${folder}/${uuid()}-${filename}`
    }).promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }
  async getDetailPublicFile(fileId: number) {
    return this.publicFilesRepository.findOne({ where: { id: fileId } })
  }
  async deletePublicFile(fileId: number) {
    const file = await this.publicFilesRepository.findOne({
      where: {
        id: fileId
      }
    })
    const s3 = new S3();
    await s3.deleteObject({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: file.key,
    }).promise()
    await this.publicFilesRepository.delete(fileId);
  }
  async deletePublicFileWithQueryRunner(fileId: number, queryRunner: QueryRunner) {
    const file = await queryRunner.manager.findOne(PublicFile, { where: { id: fileId } });
    const s3 = new S3();
    await s3.deleteObject({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: file.key,
    }).promise();
    await queryRunner.manager.delete(PublicFile, fileId);
  }
}
