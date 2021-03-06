import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CameraService } from './camera.service';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';

@ApiTags('camera')
@Controller('lockers/camera')
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  //@UseGuards(RolesAndLockerGuard)
  //@Roles('admin')
  @Post()
  create(@Body() createCameraDto: CreateCameraDto) {
    return this.cameraService.create(createCameraDto);
  }

  @Get(':lockerId')
  findAll(@Param('lockerId') lockerId: number) {
    return this.cameraService.findAll(lockerId);
  }

  @Get(':locker/:camera')
  findOne(@Param('locker') locker: string, @Param('camera') camera: string) {
    return this.cameraService.findOne(+locker, +camera);
  }

  @Patch(':locker/:camera')
  update(
    @Param('locker') locker: string,
    @Param('camera') camera: string,
    @Body() updateCameraDto: UpdateCameraDto,
  ) {
    return this.cameraService.update(+locker, +camera, updateCameraDto);
  }

  @Delete(':locker/:camera')
  remove(@Param('locker') locker: string, @Param('camera') camera: string) {
    return this.cameraService.remove(+locker, +camera);
  }
}
