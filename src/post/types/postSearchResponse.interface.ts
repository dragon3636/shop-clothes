
import { PostSearchBody } from './postSearchBody.interface';

export default interface PostSearchResult {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}