import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

import { FindOneParams } from '@/utils/findOneParams';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  // create(@Body() createProductDto: CreateProductDto) {
  //   return this.productsService.create(createProductDto);
  // }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('brands')
  getAllBrands() {
    return this.productsService.getAllBrands();
  }
  @Get(':id')
  getProductById(@Param() { id }: FindOneParams) {
    return this.productsService.getProductById(+id);
  }
}
