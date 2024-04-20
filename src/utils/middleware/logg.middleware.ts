import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction } from 'express';
import ILogger, { LoggerKey } from "src/logger/interfaces/logger.interface";
import morgan from 'morgan';
import stripAnsi from 'strip-ansi';

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  private loggerMorgan;
  public constructor(
    @Inject(LoggerKey) private logger: ILogger,
    private configService: ConfigService,
  ) {
    this.loggerMorgan = morgan(this.configService.get('NODE_ENV') === 'production' ? 'combined' : 'dev', {
      stream: {
        write: (message: string) => {
          const cleanMessage = message.replace(
            /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
          this.logger.info(cleanMessage, {
            sourceClass: 'RequestLogger',
          });
        },
      },
    });
  }
  use(req: Request, res: Response, next: NextFunction) {
    this.loggerMorgan(req, res, next);
  }
}
