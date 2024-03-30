
import { PostSearchBody } from './postSearchBody.interface';

export default interface PostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}