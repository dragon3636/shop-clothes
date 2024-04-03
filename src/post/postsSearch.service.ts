import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from './entities/post.entity';
import { PostSearchBody, UpdatePostSearchBody } from './types/postSearchBody.interface';
import PostSearchResult from './types/postSearchResponse.interface';
import PostCountResult from './types/postCountBody.interface';

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
        paragraphs: post.paragraphs,
        authorId: post.author.id
      }
    })
  }

  async search(text: string, offset?: number, limit?: number, startId = 0) {
    let separateCount = 0;
    if (startId) {
      separateCount = await this.count(text, ['title', 'paragraphs']);
    }
    const { body } = await this.elasticsearchService.search<PostSearchResult>({
      index: this.index,
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            should: {
              multi_match: {
                query: text,
                fields: ['title', 'paragraphs']
              }
            },
            filter: {
              range: {
                id: {
                  gt: startId
                }
              }
            }
          }
        },
        sort: {
          id: {
            order: 'asc'
          }
        }
      }
    })
    const hits = body.hits.hits;
    const count = body.hits.total.value;
    const results = hits.map((item) => item._source);
    return {
      count: startId ? separateCount : count,
      results
    }
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

  async count(query: string, fields: string[]) {
    const { body } = await this.elasticsearchService.count<PostCountResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query,
            fields
          }
        }
      }
    })
    return body.count;
  }
}