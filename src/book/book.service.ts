import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService){}

  async getAllBooks(page: number, limit: number, title: string, authorId: number){
    const results = await this.prisma.book.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        Title: title,
        Author_ID: authorId
      },
      include: {
        Author: {
          select: {
            Pen_Name: true
          }
        }
      }
    })
    const data = {
      List_Data: results.map(v => {
        v['Author_Pen_Name'] = v.Author.Pen_Name
        return v
      }),
      Pagination_Data: {
        Current_Page: page,
        Max_Data_Per_Page: limit,
        // Max_Page: 1,
        // Total_All_Data: 2
      }
    }
    return data
  }
  async getBook(BookId: number){
    const result = await this.prisma.book.findUnique({
      where: {
        Book_ID: BookId
      },
      include: {
        Author: {
          select: {
            Pen_Name: true
          }
        }
      }
    })
    result['Author_Pen_Name'] = result.Author.Pen_Name
    delete result['Author']
    return result
  }

  async getMyBook(page: number, limit: number, title: string){
    const results = await this.prisma.book.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        Title: title
      },
      include: {
        Author: {
          select: {
            Pen_Name: true
          }
        }
      }
    })
    const data = {
      List_Data: results.map(v => {
        v['Author_Pen_Name'] = v.Author.Pen_Name
        return v
      }),
      Pagination_Data: {
        Current_Page: page,
        Max_Data_Per_Page: limit,
        // Max_Page: 1,
        // Total_All_Data: 2
      }
    }
    return data
  }
}