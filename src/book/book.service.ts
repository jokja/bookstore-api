import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService){}

  async getAllBooks(page: number, limit: number, title: string, authorId: number){
    const results = await this.fetchBooks(page, limit, title, authorId)
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

  async getMyBook(page: number, limit: number, title: string, authorId: number){
    const results = await this.fetchBooks(page, limit, title, authorId)
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

  async fetchBooks(page: number, limit: number, title: string, authorId: number) {
    const results = await this.prisma.$transaction([
      this.prisma.book.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select: {
          Book_ID: true,
          Author_ID: true,
          Title: true,
          Summary: true,
          Stock: true,
          Price: true,
          Cover_URL: true,
          Author: {
            select: {
              Pen_Name: true
            }
          }
        },
        where: {
          Title: title,
          Author_ID: authorId
        },
      }),
      this.prisma.book.count({
        where: {
          Title: title,
          Author_ID: authorId
        }
      })
    ])

    if (results[0].length > 0) {
      results[0].map(v => {
        v['Author_Pen_Name'] = v.Author.Pen_Name
        return v
      })
    }

    return results
  }
}