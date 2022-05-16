import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AddBookDto, UpdateBookDto } from "./dto";

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

  addBook(dto: AddBookDto, authorId: number) {
    const coverUrl = null
    const book = this.prisma.book.create({
      data: {
        Author_ID: authorId,
        Title: dto.Title,
        Summary: dto.Summary,
        Price: dto.Price,
        Stock: dto.Stock,
        Cover_URL: coverUrl,
      }
    })

    return book
  }

  async updateBook(dto: UpdateBookDto, bookId: number) {
    await this.checkId(bookId)
    const book = await this.prisma.book.update({
      where: {
        Book_ID: bookId
      },
      data: {
        Title: dto.Title,
        Summary: dto.Summary,
        Price: dto.Price,
        Stock: dto.Stock
      }
    })
    return book
  }

  async deleteBook(bookId: number) {
    await this.checkId(bookId)
    await this.prisma.book.delete({
      where: {
        Book_ID: bookId
      }
    })
    return
  }

  async checkId(bookId: number) {
    const check = await this.prisma.book.findUnique({
      where: {
        Book_ID: bookId
      }
    })
    if(!check) {
      throw new HttpException({
        message: 'Error ID yang di supply tidak ada di database',
        error_key: 'error_id_not_found'
      }, 200)
    }
  }
}