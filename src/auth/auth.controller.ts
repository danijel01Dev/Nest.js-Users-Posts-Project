import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
   constructor(private readonly  authService: AuthService){ }


    @Post('register')
    Register(@Body() dto) {
      return this.authService.register(dto)
    }
    @Post('login')
   Login(@Body() Body ) {
    return this.authService.logIn(Body)
   }

    @Post('refresh')
refresh(@Body() body): Promise<{ acess_token: string; refresh_token: string; }>{
  return this.authService.refreshToken(body.refresh_token);
}
}
