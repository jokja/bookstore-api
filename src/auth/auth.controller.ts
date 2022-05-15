import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from './types';

@Controller('author')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authSerivce.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() authorId: number) {
    this.authSerivce.logout(authorId);
  }

  @Post('forgot_password')
  forgotPassword() {
    this.authSerivce.forgotPassword();
  }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authSerivce.register(dto);
  }

  @Post('change_password')
  changePassword() {
    this.authSerivce.changePassword();
  }

  @Post('refresh_token')
  refreshToken(@Body('Refresh_Token') refreshToken: string) {
    return this.authSerivce.refreshToken(refreshToken)
  }

  @Patch('update')
  update() {
    this.authSerivce.update();
  }

  @Delete('delete')
  delete() {
    this.authSerivce.delete();
  }
}
