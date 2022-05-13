import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator";

export class AllBooksDto {
  @IsInt()
  Page: number;

  @IsInt()
  Limit: number;

  @IsString()
  Title: string;

  @IsInt()
  Author_ID: number;
}
