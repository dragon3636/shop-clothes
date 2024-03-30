import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { In, Repository } from 'typeorm';
import { PostSearchService } from './postsSearch.service';
import PostNotFoundException from './exceptions/postNotFound.exception';
import { PostSearchBody, UpdatePostSearchBody } from './types/postSearchBody.interface';
import User from 'src/users/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private readonly postsSearchService: PostSearchService
  ) { }
  async create(user: User, createPostDto: CreatePostDto) {
    const newPost = await this.postsRepository.create({
      ...createPostDto,
      author: user
    });
    const savePost = await this.postsRepository.save(newPost);
    await this.postsSearchService.indexPost(savePost);
    return newPost;
  }

  findAll() {
    return this.postsRepository.find();
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
        content: updatedPost.content,
      }
      await this.postsSearchService.update(updatedPost, newBody);
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

  async searchForPosts(text: string) {
    const results = await this.postsSearchService.search(text);
    const ids = results.map(result => result.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepository
      .find({
        where: { id: In(ids) }
      });
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
    await this.postsSearchService.remove(id);
  }
}
