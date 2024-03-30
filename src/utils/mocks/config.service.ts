export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_EXPIRATION_TIME':
        return '3600'
      case 'AWS_PRIVATE_BUCKET_NAME':
        return 'nest-clothes-private'
      case 'AWS_EXPIRES_GET_SIGNED_URL':
        return 600
    }
  }
}