import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EmailDto } from './dto/email.dto';
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

  @Public()
  @Post('forgot_password')
  forgotPassword(@Body() dto: EmailDto) {
    return this.authSerivce.forgotPassword(dto);
  }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authSerivce.register(dto);
  }

  @Post('change_password')
  changePassword(
    @Body() dto: ChangePasswordDto,
    @GetCurrentUserId() authorId: number
  ) {
    return this.authSerivce.changePassword(dto, authorId);
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

  @Get('get_my_profile')
  getMyProfile(@GetCurrentUserId() authorId: number) {
    return this.authSerivce.getMyProfile(authorId);
  }
}
