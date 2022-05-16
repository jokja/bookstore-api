import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddSalesDto } from "./dto";

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService){}

  async addSales(dto: AddSalesDto, authorId: number) {
    const book = await this.prisma.book.findUnique({
      where: {
        Book_ID: dto.Book_ID
      }
    })

    if(dto.Quantity > book.Stock) {
      throw new HttpException({
        message: 'Qauntity exceeds stock',
        error_key: 'error_quantity_exceeds_stock'
      }, 200)
    }

    const sales = await this.prisma.sales.create({
      data: {
        Author_ID: book.Author_ID,
        Recipient_Name: dto.Name,
        Recipient_Email: dto.Email,
        Book_Title: book.Title,
        Quantity: dto.Quantity,
        Price_Per_Unit: book.Price,
        Price_Total: book.Price * dto.Quantity
      }
    })

    if(sales) {
      await this.prisma.book.update({
        where: {
          Book_ID: dto.Book_ID
        },
        data: {
          Stock: book.Stock - dto.Quantity
        }
      })
    }
    return
  }
}