import { HttpException, Injectable } from "@nestjs/common";
import { addHours, format, subHours } from "date-fns";
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

  async getSales(salesId: number) {
    const result = await this.prisma.sales.findUnique({
      where: {
        Sales_ID: salesId
      }
    })
    if(!result) {
      throw new HttpException({
        message: 'Error ID yang di supply tidak ada di database',
        error_key: 'error_id_not_found'
      }, 200)
    }
    return result
  }

  async getMySales(
    page: number,
    limit: number,
    title: string,
    createdStart: string,
    createdEnd: string
  ) {
    let startFormat = format(new Date(), 'yyyy-MM-dd 00:00:00')
    let endFormat = format(new Date(), 'yyyy-MM-dd 23:59:00')

    if (createdStart) {
      const start = addHours(new Date(parseInt(createdStart) * 1000), 7)
      startFormat = format(new Date(start), 'yyyy-MM-dd 00:00:00')
    }

    if (createdEnd) {
      const end = addHours(new Date(parseInt(createdEnd) * 1000), 7)
      endFormat = format(new Date(end), 'yyyy-MM-dd 23:59:00')
    }

    const results = await this.prisma.$transaction([
      this.prisma.sales.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          Book_Title: {
            contains: title,
          },
          Created_Time: {
            gte: createdStart ? new Date(startFormat) : undefined,
            lte: createdEnd ? new Date(endFormat) : undefined
          },
        },
      }),
      this.prisma.sales.count({
        where: {
          Book_Title: {
            contains: title
          },
          Created_Time: {
            gte: createdStart ? new Date(startFormat) : undefined,
            lte: createdEnd ? new Date(endFormat) : undefined
          },
        }
      })
    ])

    const totalAllData = results[1]
    const maxPage = Math.ceil(totalAllData / limit)

    const data = {
      List_Data: results[0],
      Pagination_Data: {
        Current_Page: page,
        Max_Data_Per_Page: limit,
        Max_Page: maxPage,
        Total_All_Data: totalAllData
      }
    }
    return data
  }
}