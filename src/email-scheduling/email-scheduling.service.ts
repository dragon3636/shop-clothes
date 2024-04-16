import { Injectable } from '@nestjs/common';
import { CreateEmailSchedulingDto } from './dto/create-email-scheduling.dto';
import { EmailService } from 'src/email/email.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class EmailSchedulingService {
  constructor(
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) { }
  scheduleEmail(emailSchedule: CreateEmailSchedulingDto) {
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      this.emailService.sendMail({
        to: emailSchedule.recipient,
        subject: emailSchedule.subject,
        text: emailSchedule.content
      })
    });
    this.schedulerRegistry.addCronJob(`${Date.now()}-${emailSchedule.subject}`, job)
    job.start()
  }

  cancelAllScheduledEmails() {
    this.schedulerRegistry.getCronJobs().forEach((job) => {
      job.stop();
    })
  }
}
