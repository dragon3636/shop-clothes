import User from '../../users/user.entity';
export const mockedUser: User = {
  id: 1,
  email: "user@email.com",
  password: "hash",
  name: "John",
  address: {
    id: 1,
    street: "stressName",
    city: "cityName", country: "countryName"
  }
}