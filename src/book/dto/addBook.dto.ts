import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddBookDto {
  @IsString()
  @IsNotEmpty()
  Title: string

  @IsString()
  @IsNotEmpty()
  Summary: string

  @IsInt()
  @IsNotEmpty()
  Price: number

  @IsInt()
  @IsNotEmpty()
  Stock: number

  @IsOptional()
  @IsString()
  Cover_Image_Base64: string

  @IsOptional()
  @IsString()
  Image_Extension: string
}
