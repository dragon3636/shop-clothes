import User from '../../users/user.entity';

import Role from '@/users/role.enum';

export const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  password: 'hash',
  name: 'John',
  address: {
    id: 1,
    street: 'stressName',
    city: 'cityName',
    country: 'countryName',
  },
  roles: [Role.User],
};
