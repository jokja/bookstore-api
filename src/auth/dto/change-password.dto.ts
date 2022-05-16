import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  Old_Password: string;

  @IsString()
  @IsNotEmpty()
  New_Password: string;
}
