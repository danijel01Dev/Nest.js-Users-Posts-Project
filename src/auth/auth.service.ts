import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
 
    constructor(private user : UsersService,
            private jwt : JwtService
    ){}
    async register (dto : {email: string , password : string}){
            try{ const createUser = await this.user.create(dto)
        
              const payload = { sub : createUser.id , email : createUser.email}
              const acessToken = await this.jwt.signAsync(payload , {expiresIn : '15m'});
              const refreshToken = await this.jwt.signAsync(payload , {expiresIn : '7d'});
               const hashToken = await bcrypt.hash(refreshToken, 10);
               await this.user.updateRefreshToken(createUser.id , hashToken);
               return { acess_token : acessToken,
                refresh_token : refreshToken
               }}
               catch(error){
                console.log('invalid info' , error)
                throw new NotFoundException('bad request')
               }
         }
    async logIn(dto : {email : string , password : string }){
        try{
            const dbUser = await this.user.findByEmail(dto.email);
            if(!dbUser) { throw new UnauthorizedException('Invalid Credentials')}
          const   isMatch =  await bcrypt.compare(dto.password , dbUser.password)
           if(!isMatch) { throw new UnauthorizedException('incorrect password')}
             const payload = { sub : dbUser.id , email : dbUser.email}
           const acessToken = await this.jwt.signAsync(payload , { expiresIn : '15m'})
           const refreshToken = await this.jwt.signAsync(payload , { expiresIn : '7d'})
            const hashToken = await bcrypt.hash(refreshToken, 10)
            await this.user.updateRefreshToken(dbUser.id, hashToken)
            return { acess_token : acessToken,
                refresh_token : refreshToken
            }
        }
        catch(error){
            console.log('failed to authorize user',error)
            throw new NotFoundException('bad request , failed to authorize')
        }
    }
    
    async refreshToken( kek : {sub : number , refresh_token : string}) {
        try{ const checkUser = await this.user.findOne(kek.sub)
              if(!checkUser){throw new NotFoundException('invalid user ')}
            const isMatch = await bcrypt.compare(kek.refresh_token , checkUser.refreshToken)
               if(!isMatch){ throw new UnauthorizedException('bad token')}
                const  payload = { sub : checkUser.id, email : checkUser.email}
               const acessToken = await this.jwt.signAsync(payload, { expiresIn : '15m'});
               const refreshToken = await this.jwt.signAsync(payload , {expiresIn : '7d'});
               const hashToken = await bcrypt.hash(refreshToken , 10);
               await this.user.updateRefreshToken(checkUser.id , hashToken)
               return {
                acess_token : acessToken,
                refresh_token : refreshToken,
               }

        }
        catch(error){
            console.log(error)
            throw new  UnauthorizedException(' failed to refreshToken')
        }
    }

}
