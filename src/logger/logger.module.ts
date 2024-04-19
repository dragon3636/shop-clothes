import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import ILogger, { LoggerBaseKey, LoggerKey } from './interfaces/logger.interface';
import WinstonLogger, { WinstonLoggerTransportsKey } from './winstonLogger';
import ConsoleTransport from './transports/consoleTransport';
import FileTransport from './transports/fileTransport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import SlackTransport from './transports/slackTransport';
import LoggerServiceAdapter from './LoggerServiceAdapter';
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger
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
        const isProduction = configService.get('NODE_ENV') === 'production'
        transports.push(FileTransport.create());
        if (isProduction) {
          const slackWebhookUrl = configService.get('SLACK_INC_WEBHOOK_URL');
          if (slackWebhookUrl) {
            transports.push(
              SlackTransport.create(slackWebhookUrl),
            );
          }
        } else {
          transports.push(ConsoleTransport.createColorize());
        }
        return transports;
      },
      inject: [ConfigService]
    }
  ],
  exports: [LoggerKey, LoggerServiceAdapter],

})
export class LoggerModule { }
