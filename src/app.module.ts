import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { FilesModule } from './files/files.module';
import { PostModule } from './post/post.module';
import { PrivateFileModule } from './private-file/private-file.module';
import { SearchModule } from './search/search.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './productCategories/productCategory.module';
import * as Joi from '@hapi/joi';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from './email/email.module';
import { EmailSchedulingModule } from './email-scheduling/email-scheduling.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        //
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        // 
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        AWS_PRIVATE_BUCKET_NAME: Joi.string().required(),
        AWS_MAX_SIZE_AVATAR: Joi.string().required(),
        AWS_EXPIRES_GET_SIGNED_URL: Joi.number().required(),
        // elastic
        ELASTICSEARCH_NODE: Joi.string().required(),
        ELASTICSEARCH_USERNAME: Joi.string().required(),
        ELASTICSEARCH_PASSWORD: Joi.string().required(),
        // redis
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.string().required(),
        // mail
        EMAIL_SERVICE: Joi.string().required(),
        EMAIL_USER: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    FilesModule,
    PostModule,
    PrivateFileModule,
    SearchModule,
    ProductsModule,
    ProductCategoriesModule,
    ScheduleModule.forRoot(),
    EmailModule,
    EmailSchedulingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule {

}
