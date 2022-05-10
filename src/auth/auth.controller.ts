import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { RegisterDto } from './dto/register.dto';
import { Tokens } from './types';

@Controller('author')
export class AuthController {
  constructor(private authSerivce: AuthService) {}
  @Post('/login')
  login(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authSerivce.login(dto);
  }

  @Post('/logout')
  logout() {
    this.authSerivce.logout();
  }

  @Post('/forgot_password')
  forgotPassword() {
    this.authSerivce.forgotPassword();
  }

  @Post('/register')
  register(@Body() dto: RegisterDto) {
    return this.authSerivce.register(dto);
  }

  @Post('/change_password')
  changePassword() {
    this.authSerivce.changePassword();
  }

  @Post('/refresh_token')
  refreshToken() {
    this.authSerivce.refreshToken();
  }

  @Patch('/update')
  update() {
    this.authSerivce.update();
  }

  @Delete('delete')
  delete() {
    this.authSerivce.delete();
  }
}
