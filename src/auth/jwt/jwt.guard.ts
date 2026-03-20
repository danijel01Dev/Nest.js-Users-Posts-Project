import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
  constructor(private reflector: Reflector = new Reflector()) { super(); }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true; 
    return super.canActivate(context); 
  }
}
  
 