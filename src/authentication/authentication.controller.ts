import { SendGridService } from '@anchan828/nest-sendgrid';
import {
  Controller,
  Get,
  Put,
  UseGuards,
  Request,
  Body,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AuthenticationService } from './authentication.service';
import { FirebaseAuthGuard } from './authenttication.guard';

@Controller('authen')
export class AuthenticationController {
  constructor(
    private readonly sendGrid: SendGridService,
    private service: AuthenticationService,
  ) {}
  @UseGuards(FirebaseAuthGuard)
  @Post('/signin')
  signIn(@Request() req, @Body() userDto: UpdateUserDto): Promise<any> {
    return this.service.signIn(req.user, userDto.fcm_token);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('/register')
  register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.service.register(createUserDto);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/signout')
  signout(@Request() req): Promise<any> {
    return this.service.signOut(req.user.email);
  }

  @Put('send-mail')
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

  @UseGuards(FirebaseAuthGuard)
  @Get('/send-noti')
  sendNoti(): Promise<any> {
    return this.service.sendNoti();
  }
}
