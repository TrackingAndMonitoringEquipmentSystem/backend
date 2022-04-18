import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Roles } from 'src/utils/guard/roles.decorator';
import { RolesAndDeptGuard } from 'src/utils/guard/rolesAndDept.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@ApiBearerAuth()
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Post('')
  create(
    @Request() req: ParameterDecorator,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    return this.locationService.create(createLocationDto, req['user']);
  }

  // @UseGuards(RolesAndDeptGuard)
  // @Roles('super_admin')
  // @Get()
  // findAll() {
  //   return this.locationService.findAll();
  // }

  // @Get('getById/:id')
  // findOne(@Param('id') id: string) {
  //   return this.locationService.findOne(+id);
  // }

  // //@UseGuards(RolesGuard)
  // @Roles('super_admin', 'admin')
  // @Patch('update/:id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateLocationDto: UpdateLocationDto,
  // ) {
  //   return this.locationService.update(+id, updateLocationDto);
  // }

  // //@UseGuards(RolesGuard)
  // @Roles('super_admin', 'admin')
  // @Delete('remove/:id')
  // remove(@Param('id') id: string) {
  //   return this.locationService.remove(+id);
  // }

  // @Get('getLocation')
  // getLocation(@Body() location: CreateLocationDto) {
  //   return this.locationService.getLocation(location);
  // }

  /* @Get('findLocation')
  findLocation(@Body() location: Location) {
    return this.locationService.findlocation(location);
  }*/

  @Get('/buildings')
  getBuildings() {
    return this.locationService.getAllBuilding();
  }

  @UseGuards(RolesAndDeptGuard)
  @Roles('super_admin', 'admin')
  @Get('viewByRoom')
  viewByRoom(@Request() req) {
    return this.locationService.viewByRoom(req.user);
  }
}
