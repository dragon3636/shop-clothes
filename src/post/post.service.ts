import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private readonly postsRepository: Repository<Post>) { }
  async create(userId: number, createPostDto: CreatePostDto) {
    const newPost = await this.postsRepository.create({
      ...createPostDto,
      author: userId
    });
    await this.postsRepository.save(newPost);
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
    const updatedPost = await this.postsRepository.findOne({ where: { id } });
    if (updatedPost) {
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
}
