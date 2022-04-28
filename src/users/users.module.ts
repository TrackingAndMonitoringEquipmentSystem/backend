import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CsvModule } from 'nest-csv-parser';
import { MulterModule } from '@nestjs/platform-express';
import { FileAssetsModule } from 'src/file-assets/file-assets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CsvModule,
    MulterModule.register({
      dest: './uploads/csv',
    }),
    FileAssetsModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
