import { PublicModule } from './public/public.module';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FirebaseAdminModule } from '@tfarras/nestjs-firebase-admin';
import * as admin from 'firebase-admin';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendGridModule } from '@anchan828/nest-sendgrid';
import { AuthenticationModule } from './authentication/authentication.module';
import { SharedModule } from './shared/shared.module';
import { DepartmentModule } from './department/department.module';
import { LockersModule } from './lockers/lockers.module';
import { LocationModule } from './location/location.module';
import { VideoRecordModule } from './video-record/video-record.module';
import * as FirebaseServiceAccount from './config/firebase.config.json';
import { TemporaryUserModule } from './temporary-user/temporary-user.module';
import { TemporaryDeptModule } from './temporary-dept/temporary-dept.module';
import { CameraModule } from './camera/camera.module';
import { FaceRecognitionModule } from './face-recognition/face-recognition.module';
import { EquipmentModule } from './equipment/equipment.module';
import { TypeEquipmentModule } from './type-equipment/type-equipment.module';
import { BorrowReturnModule } from './borrow-return/borrow-return.module';
import { GroupBorrowModule } from './group-borrow/group-borrow.module';
import { ReportModule } from './report/report.module';
import { RepairModule } from './repair/repair.module';
import { GroupRepairModule } from './group-repair/group-repair.module';
import { FileAssetsModule } from './file-assets/file-assets.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    FirebaseAdminModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert(
          FirebaseServiceAccount as admin.ServiceAccount,
        ),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: process.env.DB_TYPE as any,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    SendGridModule.forRoot({
      apikey: process.env.SEND_GRID_ACCESS_KEY,
    }),
    AuthenticationModule,
    SharedModule,
    DepartmentModule,
    LockersModule,
    LocationModule,
    VideoRecordModule,
    TemporaryUserModule,
    TemporaryDeptModule,
    CameraModule,
    PublicModule,
    FaceRecognitionModule,
    EquipmentModule,
    TypeEquipmentModule,
    BorrowReturnModule,
    GroupBorrowModule,
    ReportModule,
    RepairModule,
    GroupRepairModule,
    FileAssetsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
