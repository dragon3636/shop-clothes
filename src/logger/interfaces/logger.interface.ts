import { ILogData, LogLevel } from "./log.interface";

export const LoggerBaseKey = Symbol();
export const LoggerKey = Symbol();

export default interface ILogger {
  log(level: LogLevel,
    message: string | Error,
    data?: ILogData,
    profile?: string): void;
  debug(message: string, data?: ILogData, profile?: string): void;
  info(message: string, data?: ILogData, profile?: string): void;
  warn(message: string | Error, data?: ILogData, profile?: string): void;
  error(message: string | Error, data?: ILogData, profile?: string): void;
  fatal(message: string | Error, data?: ILogData, profile?: string): void;
  emergency(message: string | Error, data?: ILogData, profile?: string): void;
  startProfile(id: string): void;
}