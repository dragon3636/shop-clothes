import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './user.entity';
import { UsersService } from './users.service';
import { FilesService } from '../files/files.service';
import PublicFile from '../files/entities/publicFile.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'aws-sdk';
import { mockedConfigService } from '../utils/mocks/config.service';
import { mockedJwtService } from '../utils/mocks/jwt.service';
import { mockedUser } from '../authentication/tests/user.mock';
import { mockedFile } from '../authentication/tests/publicFile.mock';
import { PrivateFileService } from '../private-file/private-file.service';
const userArray = [
  {
    firstName: 'firstName #1',
    lastName: 'lastName #1',
  },
  {
    firstName: 'firstName #2',
    lastName: 'lastName #2',
  },
];

const oneUser = {
  ...mockedUser
};
const buffer = Buffer.from(JSON.stringify({ ok: true }));
describe('The UsersService', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;
  let findOneBy: jest.Mock;
  let uploadPublicFile: jest.Mock;
  let deletePublicFile: jest.Mock;
  let uploadPrivateFile: jest.Mock;
  let getPrivateFile: jest.Mock;
  let getSingedUrl: jest.Mock;
  let getPrivateFileSignUrl: jest.Mock;
  beforeEach(async () => {
    findOne = jest.fn();
    findOneBy = jest.fn();
    deletePublicFile = jest.fn();
    uploadPublicFile = jest.fn();
    uploadPrivateFile = jest.fn();
    getPrivateFile = jest.fn();
    getSingedUrl = jest.fn();
    getPrivateFileSignUrl = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: FilesService,
          useValue: {
            uploadPublicFile,
            deletePublicFile
          }
        },
        {
          provide: PrivateFileService,
          useValue: {
            uploadPrivateFile,
            getPrivateFile,
            getSingedUrl,
            getPrivateFileSignUrl
          }
        },
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
            findOneBy,
            update: jest.fn().mockReturnValue(true)
          }
        }
      ],
    })
      .compile();
    usersService = await module.get(UsersService);
  })
  describe('when getting a user by email', () => {
    describe('and the user is matched', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      })
      it('should return the user', async () => {
        const fetchedUser = await usersService.getByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      })
    })
    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      })
      it('should throw an error', async () => {
        await expect(usersService.getByEmail('test@test.com')).rejects.toThrow();
      })
    })
  })
  describe('when getting a user by id', () => {
    describe('and the user is matched', () => {
      beforeEach(() => {
        findOneBy.mockReturnValue(oneUser);
      })
      it('should return the user', async () => {
        const fetchedUser = await usersService.getById(1);
        expect(fetchedUser).toEqual(oneUser);
      })
    })
    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOneBy.mockReturnValue(undefined);
      })
      it('should throw an error', async () => {
        await expect(usersService.getById(1)).rejects.toThrow();
      })
    })
  })
  describe('when upload avatar', () => {
    const expectedFile = {
      ...mockedFile
    }
    delete expectedFile.id;
    describe('and the upload success', () => {
      beforeEach(() => {
        uploadPublicFile.mockResolvedValue(expectedFile);
        findOneBy.mockResolvedValue(mockedUser)
      });
      const expectedAvatar = {
        ...mockedUser,
        avatar: expectedFile
      }
      it('should return avatar of user', async () => {
        const avatar = await usersService.addAvatar(expectedAvatar.id, Buffer.from('xxx'), 'xx.png');
        expect(avatar).toEqual(expectedFile)
      });
    });
  });
});