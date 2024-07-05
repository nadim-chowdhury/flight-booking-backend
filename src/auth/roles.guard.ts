import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      return false;
    }

    const user = this.jwtService.decode(token);
    return requiredRoles.some((role) => user['roles']?.includes(role));
  }
}

//  import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
//  import { Reflector } from '@nestjs/core';

//  @Injectable()
//  export class RolesGuard implements CanActivate {
//    constructor(private reflector: Reflector) {}

//    canActivate(context: ExecutionContext): boolean {
//      const roles = this.reflector.get<string[]>('roles', context.getHandler());
//      if (!roles) {
//        return true;
//      }
//      const request = context.switchToHttp().getRequest();
//      const user = request.user;
//      return roles.some((role) => role === user.role);
//    }
//  }