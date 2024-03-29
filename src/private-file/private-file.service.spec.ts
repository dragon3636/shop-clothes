import { Test, TestingModule } from '@nestjs/testing';
import { PrivateFileService } from './private-file.service';
import PrivateFile from './privateFile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../utils/mocks/config.service';
import * as AWS from 'aws-sdk';
import User from '../users/user.entity';
import { mockedUser } from '../authentication/tests/user.mock';
import { mockedPrivateFile } from 'src/authentication/tests/publicFile.mock';
import * as mime from 'mime-types'
const s3 = new AWS.S3()
const mockedObjectS3 = {
  Key: 'key-object'
}
const fileData = {
  buffer: Buffer.from(JSON.stringify({ ok: true })),
  filename: 'sample.jpg'
}

describe('PrivateFileService', () => {
  let service: PrivateFileService;
  let findOne: jest.Mock;
  let findOneBy: jest.Mock;
  let s3Upload: jest.Mock;
  let mineLook: jest.Mock;
  let userData: User;
  beforeEach(async () => {
    findOne = jest.fn();
    findOneBy = jest.fn();
    s3Upload = jest.fn().mockReturnValue(mockedObjectS3);
    (s3.upload as jest.Mock) = s3Upload;
    mineLook = jest.fn().mockReturnValue('image/jpeg');
    (mime.lookup as jest.Mock) = mineLook;
    userData = {
      ...mockedUser
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateFileService, {
        provide: getRepositoryToken(PrivateFile),
        useValue: {
          findOne,
          findOneBy,
          create: jest.fn().mockReturnValue(mockedPrivateFile),
          save: jest.fn().mockReturnValue(true),
          update: jest.fn().mockReturnValue(true)
        },
      },
        {
          provide: ConfigService,
          useValue: mockedConfigService
        }
      ],
    }).compile();

    service = module.get<PrivateFileService>(PrivateFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
