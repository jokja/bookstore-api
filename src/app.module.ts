import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [AuthModule, PrismaModule, BookModule, SalesModule],
  // controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard
    }
  ],
})
export class AppModule {}
