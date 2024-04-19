import { LogLevel } from "@nestjs/common";

function getLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['log', 'error', 'warn']
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}
export default getLogLevels;