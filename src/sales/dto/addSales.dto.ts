import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator"

export class AddSalesDto {
  @IsNotEmpty()
  @IsString()
  Name: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  Email: string

  @IsNotEmpty()
  @IsInt()
  Quantity: number

  @IsNotEmpty()
  @IsInt()
  Book_ID: number
}