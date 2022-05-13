import { Injectable, Query } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService){}
  async getAllBooks(query){
    console.log(query.Page)
    const results = await this.prisma.book.findMany({
      skip: (parseInt(query.Page) - 1) * parseInt(query.Limit),
      take: parseInt(query.Limit),
      where: {
        title: query.Title,
        authorId: query.Author_ID
      }
    })
    console.log('result', results)
    return results
  }
  getBook(){}
}