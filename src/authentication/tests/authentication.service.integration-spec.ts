import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { mockedUser } from './user.mock';
import { AuthenticationService } from '../authentication.service';

import User from '@/users/user.entity';
import { UsersService } from '@/users/users.service';
import { mockedConfigService } from '@/utils/mocks/config.service';
import { mockedJwtService } from '@/utils/mocks/jwt.service';

describe('The Authetication', () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let bcryptCompare: jest.Mock;
  let userData: User;
  let findUser: jest.Mock;
  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;
    userData = {
      ...mockedUser,
    };
    findUser = jest.fn().mockReturnValue(userData);
    const usersRepository = {
      findOne: findUser,
    };
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();
    authenticationService = await module.get(AuthenticationService);
    usersService = await module.get(UsersService);
  });
  describe('when accessing the data for authentication user', () => {
    describe('and the provider passport is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(undefined);
      });
      it('should attempt to get a user by email', async () => {
        const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');
        expect(await authenticationService.getAuthenticatedUser('user@email.com', 'Strongpassword')).rejects.toThrow();
      });
    });
    describe('and the provider password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      describe('and the user is found in the database', () => {
        beforeEach(() => {
          findUser.mockReturnValue(userData);
        });
        it('should return the user data ', async () => {
          const user = await authenticationService.getAuthenticatedUser('user@emai.com', 'hash');
          expect(user).toBe(userData);
        });
      });
      describe('and the user isn not found in the databasse', () => {
        beforeEach(() => {
          findUser.mockReturnValue(undefined);
        });
        it('should throw an error', async () => {
          const user = await authenticationService.getAuthenticatedUser('love@email.com', 'strongpassword');
          expect(user).rejects.toThrow();
        });
      });
    });
  });
});
