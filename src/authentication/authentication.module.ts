import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { FirebaseAuthStrategy } from './firebase-auth.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [AuthenticationController], 
  providers: [AuthenticationService,FirebaseAuthStrategy]
})
export class AuthenticationModule {}