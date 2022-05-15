import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddBookDto {
  @IsNotEmpty()
  @IsString()
  Title: string

  @IsNotEmpty()
  @IsString()
  Summary: string

  @IsNotEmpty()
  @IsInt()
  Price: number

  @IsNotEmpty()
  @IsInt()
  Stock: number

  @IsOptional()
  @IsString()
  Cover_Image_Base64: string

  @IsOptional()
  @IsString()
  Image_Extension: string
}
