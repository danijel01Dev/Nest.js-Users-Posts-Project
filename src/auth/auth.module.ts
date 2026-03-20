import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports : [ UsersModule,  
            PassportModule,
           JwtModule.register({
            secret : 'kljuc',
           signOptions : {expiresIn : '1h'}
           })],
  providers: [AuthService, JwtStrategy],
             
  controllers: [AuthController],

  
})
export class AuthModule {}
