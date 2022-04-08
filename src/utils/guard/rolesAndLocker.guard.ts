import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as admin from 'firebase-admin';
import { UsersService } from "src/users/users.service";
import { LockersService } from "src/lockers/lockers.service";
import { TemporaryUserService } from "src/temporary-user/temporary-user.service";
import { TemporaryDeptService } from "src/temporary-dept/temporary-dept.service";

@Injectable()
export class RolesAndLockerGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly lockersService: LockersService,
    private readonly tempUserService: TemporaryUserService,
    private readonly tempDeptService: TemporaryDeptService,
    private reflector: Reflector) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    var roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('role', roles);
    let user;
    let hasPermission = false;
    var deptIds: any[] = [];
    console.log('test', Array.isArray(deptIds));
    const request = context.switchToHttp().getRequest();

    const headerAuthorization = request.headers.authorization;
    if (!headerAuthorization) {
      return false;
    }
    const authToken = headerAuthorization.substring(7, headerAuthorization.length);
    console.log(authToken);
    await admin.auth().verifyIdToken(authToken)
      .then((decodedToken) => {
        user = decodedToken;
      })
      .catch((error) => {
        console.log(error);
      })
    console.log('user', user);

    if (roles.includes('create')) {
      deptIds = request.body.deptId;
    } else {
      let ids = request.params.locker.split(',');
      console.log('length', ids.length);
      for (let i = 0; i < ids.length; i++) {
        let lockerDept = await this.lockersService.findLocker(ids[i]);
        let dept = [];
        for (let i = 0; i < lockerDept.department.length; i++) {
          dept.push(lockerDept.department[i].id);
        }
        deptIds.push(dept);
        console.log('lockerDept', deptIds);
      }
    }
    
    if (roles.includes(user.role)) {
      let userInfo = await this.usersService.findByEmail(user.email);
      if (user.role == 'super_admin') {
        hasPermission = true;
      } else if (user.role == 'admin') {
        for (let i = 0; i < deptIds.length; i++) {
          if (deptIds[i].includes(userInfo.dept.id)) {
            hasPermission = true;
          } else {
            hasPermission = false;
            break;
          }
        }
        console.log('admin');
      } else if (user.role == 'master_maintainer' || user.role == 'maintainer') {
        for (let i = 0; i < deptIds.length; i++) {
          if (deptIds[i].includes(userInfo.dept.id)) {
            hasPermission = true;
          } else {
            hasPermission = false;
            break;
          }
        }
        console.log('maintainer');
      } else if (user.role == 'user') {
        for (let i = 0; i < deptIds.length; i++) {
          if (deptIds[i].includes(userInfo.dept.id)) {
            hasPermission = true;
          } else {
            hasPermission = false;
            break;
          }
        }
        console.log('user');
      }
    }

    if (roles.includes('tempUser')) {
      let userInfo = await this.usersService.findByEmail(user.email);
      let tempUser = await this.tempUserService.findtempUser(request.params.locker, userInfo.id);
      let tempDept = await this.tempDeptService.findTempDept(request.params.locker, userInfo.dept.id);
      if (tempUser || tempDept ) {
        hasPermission = true;
        console.log('temp');
      } 
    }
    request.actor = user;
    return hasPermission;
  }
}