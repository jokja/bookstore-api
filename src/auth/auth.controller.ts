import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto, ChangePasswordDto, DeleteDto, EmailDto, RegisterDto, UpdateDto } from './dto';
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

  @Put('update')
  update(
    @Body() dto: UpdateDto,
    @GetCurrentUserId() authorId: number
  ) {
    return this.authSerivce.update(dto, authorId);
  }

  @Delete('delete')
  delete(
    @Body() dto: DeleteDto,
    @GetCurrentUserId() authorId: number
  ) {
    return this.authSerivce.delete(dto, authorId);
  }

  @Get('get_my_profile')
  getMyProfile(@GetCurrentUserId() authorId: number) {
    return this.authSerivce.getMyProfile(authorId);
  }
}
