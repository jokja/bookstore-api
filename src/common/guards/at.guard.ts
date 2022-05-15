import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    // const response = context.switchToHttp().getResponse()

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    
    const accessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(request)
    if(!accessToken) {
      throw new UnauthorizedException({
        message: 'Request tidak mendapati token access pada Header',
        error_key: 'error_no_auth_token'
      })
    }

    const jwt = new JwtService(new JwtModule())
    const token = jwt.decode(accessToken)
    if (Date.now() >= token['exp'] * 1000) {
      throw new UnauthorizedException({
        message: 'Refresh Token yang di supply sudah kadaluarsa',
        error_key: 'error_refresh_token_expired'
      })
    }

    return super.canActivate(context);
  }
}