import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { FindManyOptions, In, MoreThan, Repository } from 'typeorm';
import { PostSearchService } from './postsSearch.service';
import PostNotFoundException from './exceptions/postNotFound.exception';
import { PostSearchBody, UpdatePostSearchBody } from './types/postSearchBody.interface';
import User from 'src/users/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { GET_POSTS_CACHE_KEY } from './postsCacheKey.constant';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private readonly postsSearchService: PostSearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async clearCache(): Promise<boolean> {
    const keys: string[] = await this.cacheManager.store.keys();
    if (keys.length) return true
    keys.forEach(async (key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        await this.cacheManager.del(key);
      }
    })
    return true;
  }

  async create(user: User, createPostDto: CreatePostDto) {
    const newPost = await this.postsRepository.create({
      ...createPostDto,
      author: user
    });
    const savePost = await this.postsRepository.save(newPost);
    await this.postsSearchService.indexPost(savePost);
    await this.clearCache();
    return newPost;
  }

  findAll() {
    return this.postsRepository.find();
  }

  async getAllPosts(offset?: number, limit?: number, startId?: number) {
    const where: FindManyOptions<Post>['where'] = {};
    let separateCount = 0;
    if (startId) {
      where.id = MoreThan(startId);
      separateCount = await this.postsRepository.count();
    }
    const [items, count] = await this.postsRepository.findAndCount({
      where,
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });
    console.log(count);
    console.log(items.length);

    return {
      items,
      count: startId ? separateCount : count
    }
  }

  getPostById(id: number) {
    return this.postsRepository.findOne({ where: { id } });
  }

  async update(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
    if (updatedPost) {
      const newBody: UpdatePostSearchBody = {
        title: updatedPost.title,
        paragraphs: updatedPost.paragraphs,
      }
      await this.postsSearchService.update(updatedPost, newBody);
      await this.clearCache();
      return updatedPost
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }

  async searchForPosts(text: string, offset?: number, limit?: number, startId?: number) {
    const { count, results } = await this.postsSearchService.search(text, offset, limit, startId);
    const ids = results.map(result => result.id);
    if (!ids.length) {
      return {
        items: [],
        count
      }
    }
    const items = await this.postsRepository
      .find({
        where: { id: In(ids) },
        relations: ['author']
      });
    return {
      items,
      count
    }
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
    await this.postsSearchService.remove(id);
    await this.clearCache();
  }

  async getPostsWithParagraph(paragraph: string) {
    return this.postsRepository.query("SELECT * FROM post WHERE $1= ANY(paragraph)", [paragraph]);
  }
}
