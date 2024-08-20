import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import ILogger, { LoggerBaseKey, LoggerKey } from './interfaces/logger.interface';
import { LoggerService } from './logger.service';
import LoggerServiceAdapter from './LoggerServiceAdapter';
import ConsoleTransport from './transports/consoleTransport';
import FileTransport from './transports/fileTransport';
import SlackTransport from './transports/slackTransport';
import WinstonLogger, { WinstonLoggerTransportsKey } from './winstonLogger';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: LoggerServiceAdapter,
      useFactory: (logger: ILogger) => new LoggerServiceAdapter(logger),
      inject: [LoggerKey],
    },
    {
      provide: WinstonLoggerTransportsKey,
      useFactory: (configService: ConfigService) => {
        const transports = [];
        const isProduction = configService.get('NODE_ENV') === 'production';
        transports.push(FileTransport.create());
        if (isProduction) {
          console.log('xxxxxx');

          const slackWebhookUrl = configService.get('SLACK_INC_WEBHOOK_URL');
          if (slackWebhookUrl) {
            transports.push(SlackTransport.create(slackWebhookUrl));
          }
        } else {
          transports.push(ConsoleTransport.createColorize());
        }
        return transports;
      },
      inject: [ConfigService],
    },
  ],
  exports: [LoggerKey, LoggerServiceAdapter],
})
export class LoggerModule {}
