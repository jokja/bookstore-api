import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { GetCurrentUserId } from "src/common/decorators";
import { AddSalesDto } from "./dto/addSales.dto";
import { SalesService } from "./sales.service";

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService){}

  @Post('add')
  addSales(@Body() dto: AddSalesDto, @GetCurrentUserId() authorId: number) {
    return this.salesService.addSales(dto, authorId)
  }

  @Get('get/:id')
  getSales(@Param('id', ParseIntPipe) salesId: number){
    return this.salesService.getSales(salesId)
  }
  
  @Get('get_my_sales')
  getMySales(
    @Query('Page', ParseIntPipe) page: number,
    @Query('Limit', ParseIntPipe) limit: number,
    @Query('Book_Title') title: string,
    @Query('Created_Time_Start') createdStart: string,
    @Query('Created_Time_End') createdEnd: string,
  ){
    return this.salesService.getMySales(page, limit, title, createdStart, createdEnd)
  }

}