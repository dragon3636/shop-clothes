import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

import ILogger, { LoggerKey } from '@/logger/interfaces/logger.interface';

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  public constructor(
    @Inject(LoggerKey) private logger: ILogger,
    private configService: ConfigService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    morgan(this.configService.get('NODE_ENV') === 'production' ? 'combined' : 'dev', {
      stream: {
        write: (message: string) => {
          const cleanMessage = message.replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
            '',
          );
          this.logger.debug(cleanMessage, {
            sourceClass: 'RequestLogger',
          });
        },
      },
    });
    next();
  }
}
