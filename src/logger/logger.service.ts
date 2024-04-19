import { Injectable, LogLevel, LoggerService, Provider, Scope } from '@nestjs/common';
import logger from './winston.config';
@Injectable()
export class MyLogger implements LoggerService {
  log(message: string, context?: string) {
    logger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    logger.error(message, { context, trace });
  }

  warn(message: string, context?: string) {
    logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    logger.debug(message, { context });
  }
}

export const LoggerProvider: Provider<MyLogger> = {
  provide: MyLogger,
  scope: Scope.REQUEST,
  useFactory: () => new MyLogger(),
};