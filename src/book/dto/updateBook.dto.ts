import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateBookDto {
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
}
