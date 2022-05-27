import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import * as admin from 'firebase-admin';

@Injectable()
export class RolesAndSelfGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const headerAuthorization = request.headers.authorization;
    if (!headerAuthorization) {
      return false;
    }
    const authToken = headerAuthorization.substring(
      7,
      headerAuthorization.length,
    );
    console.log('authToken:', authToken);
    let actor: any;
    try {
      actor = await admin.auth().verifyIdToken(authToken);
    } catch (error) {
      console.log('verifyIdToken error:', error);
      return false;
    }
    const userData = await this.usersService.findByEmail(actor.email);
    request.user = userData;
    request.firebaseUser = actor;
    let id = request.params.id;
    if (!id) {
      id = userData.id;
    }
    if (roles.includes('self') && id == userData.id) {
      return true;
    } else if (roles.includes(actor.role)) {
      return true;
    }
    return false;
  }
}
