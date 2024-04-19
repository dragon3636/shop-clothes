import { Injectable } from '@nestjs/common';
import ContextStorageService from './contextStorage.interface';
import { CLS_ID, ClsService } from 'nestjs-cls';

@Injectable()
export class ClsContextStorageService implements ContextStorageService {
  constructor(private readonly cls: ClsService) { }
  getContextId(): string {
    return this.cls.get(CLS_ID);
  }
  setContextId(contextId: string): void {
    this.cls.set(CLS_ID, contextId)
  }

  get<T>(key: string): T | undefined {
    return this.cls.get(key);
  }
  set<T>(key: string, value: T) {
    this.cls.set(key, value);
  }

}
