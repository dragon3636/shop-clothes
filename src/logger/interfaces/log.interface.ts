export enum LogLevel {
  Emergency = 'emegemcy',
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'infor',
  Debug = 'debug',
}
export interface ILogData {
  organization?: string;
  context?: string;
  app?: string;
  sourceClass?: string;
  correlationId?: string;
  error?: Error;
  props?: NodeJS.Dict<any>;
}
export interface ILog {
  timestamp: number;
  level: LogLevel;
  message: string;
  data: ILogData
}