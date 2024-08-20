import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { CreateEmailSchedulingDto } from './dto/create-email-scheduling.dto';
import { EmailSchedulingService } from './email-scheduling.service';

import JwtAuthenticationGuard from '@/authentication/jwt-authentication.guard';

@Controller('email-scheduling')
export class EmailSchedulingController {
  constructor(private readonly emailSchedulingService: EmailSchedulingService) {}

  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() createEmailSchedulingDto: CreateEmailSchedulingDto) {
    return this.emailSchedulingService.scheduleEmail(createEmailSchedulingDto);
  }
}
