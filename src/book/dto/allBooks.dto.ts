import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AllBooksDto {
  @IsNotEmpty()
  Page: number;

  @IsNotEmpty()
  Limit: number;

  @IsOptional()
  Title: string;

  @IsInt()
  Author_ID: number;
}
