import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  constructor(private configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: this.configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
      secure: false,
      debug: false,
      logger: true
    })
  }
  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
