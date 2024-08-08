import { Global, Module } from '@nestjs/common';
import { ClsContextStorageService } from './context.service';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';
import { ContextStorageServiceKey } from './contextStorage.interface';

@Global()
@Module({
  controllers: [],
  exports: [ContextStorageServiceKey],
  providers: [
    {
      provide: ContextStorageServiceKey,
      useClass: ClsContextStorageService,
    },
  ],
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req) => req.headers['x-correlation-id'] ?? v4(),
        // setup: (cls, req) => {
        //   cls.set('userId', req.headers['x-user-id']);
        // },
      },
    }),
  ],
})
export class ContextModule {}
