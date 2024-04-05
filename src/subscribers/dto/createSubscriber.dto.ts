import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateSubscriberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}