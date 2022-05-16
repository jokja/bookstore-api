import { IsNotEmpty, IsString } from "class-validator";

export class UpdateDto {
  @IsString()
  @IsNotEmpty()
  Name: string;

  @IsString()
  @IsNotEmpty()
  Pen_Name: string;
}
