import { Controller, Get, Param, Query } from "@nestjs/common";
import { BookService } from "./book.service";
import { AllBooksDto } from "./dto";

@Controller('book')
export class BookController {
  constructor(private bookService: BookService){}
  @Get('/get')
  getAllBooks(@Query() query) {
    console.log('params', query)
    return this.bookService.getAllBooks(query)
  }

  @Get('/get/:id')
  getBook(){
    this.bookService.getBook()
  }

}