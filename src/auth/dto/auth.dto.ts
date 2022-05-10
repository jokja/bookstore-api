import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  Email: string;

  @IsNotEmpty()
  @IsString()
  Password: string;
}
