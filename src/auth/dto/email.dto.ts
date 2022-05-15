import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  Email: string;
}
