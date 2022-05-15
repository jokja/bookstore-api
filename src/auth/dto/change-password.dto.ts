import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  Old_Password: string;

  @IsNotEmpty()
  @IsString()
  New_Password: string;
}
