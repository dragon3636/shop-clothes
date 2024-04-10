import { CACHE_KEY_METADATA, CacheInterceptor } from "@nestjs/cache-manager"
import { ExecutionContext } from "@nestjs/common"

export class HttpInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    if (cacheKey) {
      const request = context.switchToHttp().getRequest();
      return `${cacheKey}-${request._parsedUrl.query}`;
    }
    return super.trackBy(context);
  }
}