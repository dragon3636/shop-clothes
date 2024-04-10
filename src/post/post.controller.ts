import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ClassSerializerInterceptor, UseInterceptors, Inject } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { FindOneParams } from 'src/utils/findOneParams';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { PaginationParams } from 'src/utils/types/paginationParams';
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { GET_POSTS_CACHE_KEY } from './postsCacheKey.constant';
import { HttpInterceptor } from './types/httpCache.interceptor';

@Controller('post')
@UseInterceptors(ClassSerializerInterceptor)
export class PostController {
  constructor(
    private readonly postService: PostService,
  ) { }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(
    @Req() request: RequestWithUser,
    @Body() createPostDto: CreatePostDto) {
    return this.postService.create(request.user, createPostDto);
  }
  @UseInterceptors(HttpInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  findAll(
    @Query('search') search: string,
    @Query() { offset, limit, startId }: PaginationParams
  ) {
    if (search) {
      return this.postService.searchForPosts(search, offset, limit, startId);
    }
    return this.postService.getAllPosts(offset, limit, startId);
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.postService.getPostById(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  update(@Req() request: RequestWithUser, @Param() { id }: FindOneParams, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.postService.remove(+id);
  }
}
