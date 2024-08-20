import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';

import { mockedUser } from './user.mock';
import { AuthenticationController } from '../authentication.controller';
import { AuthenticationService } from '../authentication.service';

import User from '@/users/user.entity';
import { UsersService } from '@/users/users.service';
import { mockedConfigService } from '@/utils/mocks/config.service';
import { mockedJwtService } from '@/utils/mocks/jwt.service';

describe('The AuthenticationController', () => {
  let app: INestApplication;
  let userData: User;
  beforeEach(async () => {
    userData = {
      ...mockedUser,
    };
    const usersRepository = {
      create: jest.fn().mockReturnValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };
    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: getRepositoryToken(User), useValue: usersRepository },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  const urlRegister = '/authentication/register';
  describe('and using invalid data', () => {
    it('should respond with data of the without password', async () => {
      const expectedData = {
        ...userData,
      };
      delete expectedData.password;
      return request(app.getHttpServer())
        .post('/authentication/register')
        .send({
          email: expectedData.email,
          name: expectedData.name,
          password: 'Strongpassword',
        })
        .expect(201)
        .expect(expectedData);
    });
  });
  describe('and using invalid data', () => {
    it('should throw an error', async () => {
      return request(app.getHttpServer())
        .post('/authentication/register')
        .send({
          name: mockedUser.name,
        })
        .expect(201);
    });
  });
});
