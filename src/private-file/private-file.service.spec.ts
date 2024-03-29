import { Test, TestingModule } from '@nestjs/testing';
import { PrivateFileService } from './private-file.service';

describe('PrivateFileService', () => {
  let service: PrivateFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrivateFileService],
    }).compile();

    service = module.get<PrivateFileService>(PrivateFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
