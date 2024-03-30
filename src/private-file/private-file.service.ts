import { Injectable, NotFoundException, UnsupportedMediaTypeException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PrivateFile from './privateFile.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ParamSignUrl } from './param-s3.interface';
import * as mime from 'mime-types'
@Injectable()
export class PrivateFileService {
  constructor(
    @InjectRepository(PrivateFile)
    private privateFilesRepository: Repository<PrivateFile>,
    private readonly configService: ConfigService
  ) { }
  async uploadPrivateFile(dataBuffer: Buffer, ownerId: number, filename: string, folder?: string) {
    const s3 = new S3();
    const extension = filename.split('.').reverse()[0];
    const fileExtension = mime.lookup(extension);
    if (fileExtension) {
      const uploadResult = await s3.upload({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Body: dataBuffer,
        Key: folder ? `${folder}/${uuid()}-${filename}` : `${uuid()}-${filename}`,
        ContentType: fileExtension
      }).promise();
      const newFile = this.privateFilesRepository.create({
        key: uploadResult.Key,
        owner: {
          id: ownerId
        }
      });
      await this.privateFilesRepository.save(newFile);
      return newFile;
    }
    throw new UnsupportedMediaTypeException()
  }
  public async getPrivateFile(fileId: number) {
    const s3 = new S3();
    const fileInfo = await this.privateFilesRepository.findOne({ where: { id: fileId }, relations: ['owner'] })
    if (fileInfo) {
      const stream = await s3.getObject({
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: fileInfo.key
      }).createReadStream();
      return {
        stream,
        fileInfo
      }
    }
    throw new NotFoundException()
  }
  public getSingedUrl(fileKey: string, contentType?: string) {
    const s3 = new S3();
    const param: ParamSignUrl = {
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: fileKey,
      Expires: this.configService.get('AWS_EXPIRES_GET_SIGNED_URL')
    };
    if (contentType) {
      param.ResponseContentType = contentType;
    }
    return s3.getSignedUrlPromise('getObject', param);
  }

  public async getPrivateFileSignUrl(fileId: number) {
    const fileInfo = await this.privateFilesRepository.findOne({
      where: { id: fileId },
      relations: ['owner']
    })
    if (fileInfo) {
      const extension = fileInfo.key.split('.').reverse()[0];
      const fileExtension = mime.lookup(extension);
      if (fileExtension) {
        const signedUrl = await this.getSingedUrl(fileInfo.key, fileExtension);
        return {
          signedUrl,
          fileInfo
        }
      }
    }
    throw new NotFoundException()
  }
}