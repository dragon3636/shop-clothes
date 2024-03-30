import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostSearchService } from './postsSearch.service';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), SearchModule],
  controllers: [PostController],
  providers: [PostService, PostSearchService],
})
export class PostModule { }
