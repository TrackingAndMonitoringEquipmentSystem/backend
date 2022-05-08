import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SendGridService } from '@anchan828/nest-sendgrid';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { getResponse } from 'src/utils/response';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sendGrid: SendGridService,
  ) {}

  async signIn(user: any, fcm_token: string): Promise<any> {
    if (!user['email_verified']) {
      throw new HttpException(getResponse('02', null), HttpStatus.FORBIDDEN);
    }
    let result = await this.usersService.findByEmail(user['email']);
    if (!result) {
      throw new HttpException(getResponse('03', null), HttpStatus.FORBIDDEN);
    }
    if (result.status == 'Approved') {
      const userRole = await this.usersService.findRole(result.id);
      await admin.auth().setCustomUserClaims(user['uid'], {
        role: userRole,
      });
      await this.usersService.updateUser(
        result.id,
        {
          status: 'Signingin',
          fcm_token: fcm_token,
        },
        result.id,
      );
      result = await this.usersService.findById(result.id);
      return getResponse('00', result);
    } else if (result.status == 'SignedOut' || result.status == 'Signingin') {
      await this.usersService.updateUser(
        result.id,
        {
          status: 'Signingin',
          fcm_token: fcm_token,
        },
        result.id,
      );
      result = await this.usersService.findById(result.id);
      return getResponse('00', result);
    } else {
      throw new HttpException(getResponse('04', null), HttpStatus.FORBIDDEN);
    }
  }

  async register(userDto: CreateUserDto): Promise<any> {
    let result = await this.usersService.findByEmail(userDto.email);
    console.log(result);
    if (result) {
      if (result.status == 'Approved') {
        await this.usersService.updateUser(result.id, userDto, result.id);
        result = await this.usersService.findById(result.id);
        console.log('response', getResponse('00', result));
        return getResponse('00', result);
      }
      /* else {
        return getResponse('01',null);}*/
    } else {
      userDto.status = 'WaitingForValidateEmail';
      const user = await this.usersService.createUser(userDto);
      console.log('->user:', user);
      const getAdmin = await this.usersService.findByRole(
        ['super_admin', 'admin'],
        user.dept.id,
        {
          status: 'Signingin',
        },
      );
      console.log('admin', getAdmin);
      const tokens = getAdmin.map((token) => token.fcm_token);
      console.log('tokens', tokens);
      const message = {
        notification: {
          title: 'Register Successful',
          body: '12345',
        },
        tokens: tokens,
      };
      if (tokens.length) {
        admin
          .messaging()
          .sendMulticast(message)
          .then((response) => {
            console.log('Successfully sent message:', response);
          })
          .catch((error) => {
            console.log('Error sending message:', error);
          });
      }

      return getResponse('00', user);
    }
  }

  async signOut(email: string): Promise<any> {
    const result = await this.usersService.findByEmail(email);
    await this.usersService.updateUser(
      result.id,
      {
        status: 'SignedOut',
        fcm_token: null,
      },
      result.id,
    );
    return getResponse('00', null);
  }

  async sendMail(): Promise<any> {
    const result = await this.sendGrid.send({
      to: 'supreeyafon22@gmail.com',
      from: '61010103@kmitl.ac.th',
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    return result;
  }

  async sendNoti(): Promise<any> {
    const user = await this.usersService.findById(4);
    console.log('department', user.dept.id);
    const getAdmin = await this.usersService.findByRole(
      ['super_admin', 'admin'],
      user.dept.id,
    );
    console.log('admin', getAdmin);
    const tokens = getAdmin.map((token) => token.fcm_token);
    console.log('tokens', tokens);
    const message = {
      notification: {
        title: 'test',
        body: '12345',
      },
      tokens: tokens,
    };
    admin
      .messaging()
      .sendMulticast(message)
      .then((response) => {
        console.log('Successfully sent message:', response.successCount);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
}
