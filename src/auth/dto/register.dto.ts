import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  Name: string;

  @IsNotEmpty()
  @IsString()
  Pen_name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  Email: string;

  @IsNotEmpty()
  @IsString()
  Password: string;
}
