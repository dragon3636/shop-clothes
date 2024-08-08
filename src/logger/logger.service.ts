import { Inject, Injectable, Provider, Scope } from '@nestjs/common';
import ILogger, { LoggerBaseKey } from './interfaces/logger.interface';
import { ConfigService } from '@nestjs/config';
import ContextStorageService, { ContextStorageServiceKey } from 'src/context/contextStorage.interface';
import { INQUIRER } from '@nestjs/core';
import { LogLevel, ILogData } from './interfaces/log.interface';
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILogger {
  private sourceClass: string;
  private organization: string;
  private context: string;
  private app: string;
  constructor(
    @Inject(LoggerBaseKey) private logger: ILogger,
    configService: ConfigService,
    @Inject(INQUIRER) parentClass: object,
    @Inject(ContextStorageServiceKey)
    private contextStorageService: ContextStorageService,
  ) {
    // Set the source class from the parent class
    this.sourceClass = parentClass?.constructor?.name;

    // Set the organization, context and app from the environment variables
    this.organization = configService.get<string>('ORGANIZATION');
    this.context = configService.get<string>('CONTEXT');
    this.app = configService.get<string>('APP');
  }
  public log(level: LogLevel, message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.log(level, message, this.getLogData(data), profile);
  }
  public debug(message: string, data?: ILogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile);
  }

  public info(message: string, data?: ILogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile);
  }

  public warn(message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile);
  }

  public error(message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile);
  }

  public fatal(message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile);
  }

  public emergency(message: string | Error, data?: ILogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile);
  }

  private getLogData(data?: ILogData): ILogData {
    return {
      ...data,
      organization: data?.organization || this.organization,
      context: data?.context || this.context,
      app: data?.app || this.app,
      sourceClass: data?.sourceClass || this.sourceClass,
      correlationId: data?.correlationId || this.contextStorageService.getContextId(),
    };
  }
  public startProfile(id: string) {
    this.logger.startProfile(id);
  }
}
