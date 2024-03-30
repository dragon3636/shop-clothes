import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from './entities/post.entity';
import { PostSearchBody, UpdatePostSearchBody } from './types/postSearchBody.interface';
import PostSearchResult from './types/postSearchResponse.interface';

@Injectable()
export class PostSearchService {
  index = 'posts'
  constructor(private readonly elasticsearchService: ElasticsearchService) { }
  async indexPost(post: Post) {
    return this.elasticsearchService.index<PostSearchResult, PostSearchBody>({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.author.id
      }
    })
  }

  async search(text: string) {
    const { body } = await this.elasticsearchService.search<PostSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content']
          }
        }
      }
    })
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove(postId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          }
        }
      }
    })
  }
  async update(post: Post, newBody: UpdatePostSearchBody) {
    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');
    console.log("🚀 ~ PostSearchService ~ script ~ script:", script);
    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          }
        },
        script: {
          inline: script
        }
      }
    })
  }
}