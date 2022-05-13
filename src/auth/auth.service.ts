import { ForbiddenException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt'
import { Tokens, User } from './types';
import { JwtService } from '@nestjs/jwt'
import { PrismaClient } from '.prisma/client';

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
          expiresIn: 60 * 60 * 24 * 7
        }
      )
    ])

    return {
      access_token: at,
      refresh_token: rt
    }
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt)
    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        hashedRt: hash
      }
    })
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.Email
      }
    })

    if (!user) throw new HttpException({
      message: 'Email tidak ditemukan di data Author',
      error_key: 'error_invalid_password'
    }, 200)
    const passwordMatches = await bcrypt.compare(dto.Password, user.hash)
    if (!passwordMatches) throw new HttpException({
      message: 'Password tidak sesuai',
      error_key: 'error_email_not_found'
    }, 200)

    const tokens = await this.getTokens(user.id, user.email)
    await this.updateRtHash(user.id, tokens.refresh_token)
    return tokens
  }

  logout() {}

  forgotPassword() {}

  async register(dto: RegisterDto): Promise<User> {
    const hash = await this.hashData(dto.Password)
    const email = await this.prisma.user.findUnique({
      where: {
        email: dto.Email
      }
    })
    if (email) {
      throw new HttpException({
        message: 'Email sudah ada pada data Author dan tidak bisa di registrasi lagi',
        error_key: 'error_email_duplicate'
      }, 200)
    }
    const newUser = await this.prisma.user.create({
      data: {
        name: dto.Name,
        penName: dto.Pen_name,
        email: dto.Email,
        hash
      }
    })
    const tokens = await this.getTokens(newUser.id, newUser.email)
    await this.updateRtHash(newUser.id, tokens.refresh_token)
    return {
      name: newUser.name,
      pen_name: newUser.penName,
      email: newUser.email
    }
  }

  changePassword() {}

  refreshToken() {}

  update() {}

  delete() {}
}
