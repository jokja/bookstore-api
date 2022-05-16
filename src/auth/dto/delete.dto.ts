import { IsNotEmpty, IsString } from "class-validator";

export class DeleteDto {
  @IsString()
  @IsNotEmpty()
  Refresh_Token: string;
}
