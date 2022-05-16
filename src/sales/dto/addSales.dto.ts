import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator"

export class AddSalesDto {
  @IsString()
  @IsNotEmpty()
  Name: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  Email: string

  @IsInt()
  @IsNotEmpty()
  Quantity: number

  @IsInt()
  @IsNotEmpty()
  Book_ID: number
}