import { IsEmail, IsString, IsNotEmpty, IsDateString } from "class-validator";

export class CreateEmailSchedulingDto {
  @IsEmail()
  recipient: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  date: string;
}
