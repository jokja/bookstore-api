import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { BookService } from "./book.service";
// import { AllBooksDto } from "./dto";

@Controller('book')
export class BookController {
  constructor(private bookService: BookService){}
  @Get('/get')
  getAllBooks(
    @Query('Page', ParseIntPipe) page: number,
    @Query('Limit', ParseIntPipe) limit: number,
    @Query('Title') title: string,
    @Query('Author_ID') authorId?
  ) {
    return this.bookService.getAllBooks(page, limit, title, authorId ? parseInt(authorId) : authorId)
  }

  @Get('/get/:id')
  getBook(@Param('id', ParseIntPipe) BookId: number){
    return this.bookService.getBook(BookId)
  }

}