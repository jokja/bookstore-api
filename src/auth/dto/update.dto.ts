import { IsNotEmpty, IsString } from "class-validator";

export class UpdateDto {
  @IsNotEmpty()
  @IsString()
  Name: string;

  @IsNotEmpty()
  @IsString()
  Pen_Name: string;
}
