import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';

import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostSearchService } from './postsSearch.service';

import type { RedisClientOptions } from 'redis';

import { CaslModule } from '@/casl/casl.module';
import { SearchModule } from '@/search/search.module';
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 1200,
      }),
    }),
    TypeOrmModule.forFeature([Post]),
    SearchModule,
    CaslModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostSearchService],
})
export class PostModule {}
