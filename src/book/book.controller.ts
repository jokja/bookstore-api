import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { GetCurrentUserId, Public } from "src/common/decorators";
import { BookService } from "./book.service";

@Controller('book')
export class BookController {
  constructor(private bookService: BookService){}

  @Public()
  @Get('get')
  getAllBooks(
    @Query('Page', ParseIntPipe) page: number,
    @Query('Limit', ParseIntPipe) limit: number,
    @Query('Title') title: string,
    @Query('Author_ID') authorId?
  ) {
    return this.bookService.getAllBooks(page, limit, title, authorId ? parseInt(authorId) : authorId)
  }

  @Public()
  @Get('get/:id')
  getBook(@Param('id', ParseIntPipe) BookId: number){
    return this.bookService.getBook(BookId)
  }

  @Get('get_my_book')
  getMyBook(
    @Query('Page', ParseIntPipe) page: number,
    @Query('Limit', ParseIntPipe) limit: number,
    @Query('Title') title: string,
    @GetCurrentUserId() authorId: number
  ) {
    return this.bookService.getMyBook(page, limit, title, authorId)
  }

}