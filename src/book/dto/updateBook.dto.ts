import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateBookDto {
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
}
