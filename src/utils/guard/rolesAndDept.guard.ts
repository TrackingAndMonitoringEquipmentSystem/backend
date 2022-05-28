import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesAndDeptGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    let actor;
    let hasPermission = false;
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
    try {
      actor = await admin.auth().verifyIdToken(authToken);
    } catch (error) {
      console.error(error);
      return false;
    }
    const id = request.params.id;
    const body = request.body;
    const actorInfo = await this.usersService.findByEmail(actor.email);
    if (roles.includes('self') && roles.includes(actor.role)) {
      if (id == actorInfo.id) {
        hasPermission = true;
      } else if (actor.role == 'super_admin') {
        hasPermission = true;
      } else if (actor.role == 'admin') {
        if (
          !id &&
          actorInfo.dept.id == body.dept &&
          (body.role == 2 || body.role == 5)
        ) {
          hasPermission = true;
        } else if (id) {
          const idConvertToNum = id.split(',').map(Number);
          for (let i = 0; i < idConvertToNum.length; i++) {
            const userInfo = await this.usersService.findById(
              idConvertToNum[i],
            );
            if (
              actorInfo.dept.id == userInfo.dept.id &&
              (userInfo.role.id == 2 || userInfo.role.id == 5)
            ) {
              hasPermission = true;
              // console.log('admin');
            } else {
              hasPermission = false;
              break;
            }
          }
        }
      } else if (actor.role == 'master_maintainer') {
        if (
          !id &&
          actorInfo.dept.id == body.dept &&
          (body.role == 3 || body.role == 4)
        ) {
          hasPermission = true;
        } else if (id) {
          const idConvertToNum = id.split(',').map(Number);
          for (let i = 0; i < idConvertToNum.length; i++) {
            const userInfo = await this.usersService.findById(
              idConvertToNum[i],
            );
            if (
              actorInfo.dept.id == userInfo.dept.id &&
              (userInfo.role.id == 3 || userInfo.role.id == 4)
            ) {
              hasPermission = true;
              // console.log('admin');
            } else {
              hasPermission = false;
              break;
            }
          }
        }
      }
    } else if (roles.includes(actor.role)) {
      hasPermission = true;
    }

    request.actor = actorInfo.email;
    request.actorId = actorInfo.id;
    request.user = actorInfo;
    return hasPermission;
  }
}
