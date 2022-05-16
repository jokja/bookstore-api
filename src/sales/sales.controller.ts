import { Body, Controller, Post } from "@nestjs/common";
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
}