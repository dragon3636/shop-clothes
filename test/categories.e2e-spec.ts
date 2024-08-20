import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CategoriesService } from 'src/categories/categories.service';
import { UpdateCategoryDto } from 'src/categories/dto/update-category.dto';
import request from 'supertest';

import { AppModule } from './../src/app.module';

describe('Categories (e2e)', () => {
  let app: INestApplication;
  const categoriesService: CategoriesService = {
    create: () => 'test create category',
    findAll: function (): string {
      return `This action returns all categories`;
    },
    findOne: function (id: number): string {
      return `This action returns a #${id} category`;
    },
    update: function (id: number, updateCategoryDto: UpdateCategoryDto): string {
      return `This action updates a #${id} category`;
    },
    remove: function (id: number): string {
      return `This action removes a #${id} category`;
    },
  };
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CategoriesService)
      .useValue(categoriesService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) categories', () => {
    return request(app.getHttpServer()).get('/categories').expect(200).expect(categoriesService.findAll());
  });
});
