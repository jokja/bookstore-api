import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt'
import { MyProfile, Tokens, User } from './types';
import { JwtService } from '@nestjs/jwt'
import { EmailDto } from './dto/email.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async getTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        }, {
          secret: 'at-secret',
          expiresIn: 60 * 15
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        }, {
          secret: 'rt-secret',
          expiresIn: 60 * 60 * 24
        }
      )
    ])

    return {
      Access_Token: at,
      Refresh_Token: rt
    }
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt)
    await this.prisma.author.update({
      where: {
        Author_ID: userId
      },
      data: {
        Hashed_RT: hash
      }
    })
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.author.findUnique({
      where: {
        Email: dto.Email
      }
    })

    if (!user) throw new HttpException({
      message: 'Email tidak ditemukan di data Author',
      error_key: 'error_invalid_password'
    }, 200)
    const passwordMatches = await bcrypt.compare(dto.Password, user.Hash)
    if (!passwordMatches) throw new HttpException({
      message: 'Password tidak sesuai',
      error_key: 'error_email_not_found'
    }, 200)

    const tokens = await this.getTokens(user.Author_ID, user.Email)
    await this.updateRtHash(user.Author_ID, tokens.Refresh_Token)
    return tokens
  }

  async logout(authorId: number) {
    await this.prisma.author.updateMany({
      where: {
        Author_ID: authorId,
        Hashed_RT: {
          not: null
        }
      },
      data: {
        Hashed_RT: null
      }
    })
  }

  async forgotPassword(dto: EmailDto) {
    const author = await this.prisma.author.findUnique({
      where: {
        Email: dto.Email
      }
    })
    if(!author) {
      throw new HttpException({
        message: 'Email tidak ditemukan di data Author',
        error_key: 'error_email_not_found'
      }, 200)
    }

    const newPassword = '123qwe'
    const hash = await this.hashData(newPassword)
    await this.prisma.author.update({
      where: {
        Email: dto.Email
      },
      data: {
        Hash: hash
      }
    })
    const tokens = await this.getTokens(author.Author_ID, author.Email)
    await this.updateRtHash(author.Author_ID, tokens.Refresh_Token)
    return {
      // New_Password: Math.random().toString(36).slice(-8)
      New_Password: newPassword
    }
  }

  async register(dto: RegisterDto): Promise<User> {
    const hash = await this.hashData(dto.Password)
    const email = await this.prisma.author.findUnique({
      where: {
        Email: dto.Email
      }
    })
    if (email) {
      throw new HttpException({
        message: 'Email sudah ada pada data Author dan tidak bisa di registrasi lagi',
        error_key: 'error_email_duplicate'
      }, 200)
    }
    const newUser = await this.prisma.author.create({
      data: {
        Name: dto.Name,
        Pen_Name: dto.Pen_name,
        Email: dto.Email,
        Hash: hash
      }
    })
    const tokens = await this.getTokens(newUser.Author_ID, newUser.Email)
    await this.updateRtHash(newUser.Author_ID, tokens.Refresh_Token)
    return {
      Name: newUser.Name,
      Pen_Name: newUser.Pen_Name,
      Email: newUser.Email
    }
  }

  changePassword() {}

  async refreshToken(refreshToken: string): Promise<Tokens> {
    const user = this.jwtService.decode(refreshToken)
    if (!user) {
      throw new HttpException({
        message: 'Refresh Token yang di supply tidak sesuai ketentuan / settingan token',
        error_key: 'error_refresh_token_invalid'
      }, 200)
    }

    const author = await this.prisma.author.findUnique({
      where: {
        Author_ID: user.sub,
      }
    })
    
    if (!author || !author.Hashed_RT) throw new HttpException({
      message: 'Refresh Token yang di supply tidak sesuai ketentuan / settingan token',
      error_key: 'error_refresh_token_invalid'
    }, 200)

    if (Date.now() >= user['exp'] * 1000) {
      throw new HttpException({
        message: 'Refresh Token yang di supply sudah kadaluarsa',
        error_key: 'error_refresh_token_expired'
      }, 200)
    }

    const rtMatches = await bcrypt.compare(refreshToken, author.Hashed_RT)
    if (!rtMatches) throw new ForbiddenException('Access Denied')

    const tokens = await this.getTokens(author.Author_ID, author.Email)
    await this.updateRtHash(author.Author_ID, tokens.Refresh_Token)

    return tokens
  }

  update() {}

  delete() {}

  async getMyProfile(authorId: number): Promise<MyProfile> {
    if (!authorId) {
      throw new HttpException({
        message: 'Token access pada Header tidak sesuai ketentuan / settingan token',
        error_key: 'error_invalid_token'
      }, 200)
    }
    const user = await this.prisma.author.findUnique({
      where: {
        Author_ID: authorId
      }
    })

    if(!user) {
      throw new HttpException({
        message: 'Author ID tidak di temukan',
        error_key: 'error_author_id_not_found'
      }, 200)
    }

    return {
      Author_ID: user.Author_ID,
      Name: user.Name,
      Pen_Name: user.Pen_Name,
      Email: user.Email
    }
  }
}
