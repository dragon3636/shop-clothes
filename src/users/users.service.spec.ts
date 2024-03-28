import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from './user.entity';
import { UsersService } from './users.service';
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
  firstName: 'firstName #1',
  lastName: 'lastName #1',
};

describe('The UsersService', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;
  let findOneBy: jest.Mock;
  beforeEach(async () => {
    findOne = jest.fn();
    findOneBy = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne,
            findOneBy
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
});