import { PartialType } from '@nestjs/swagger';
import { CreateVideoRecordDto } from './create-video-record.dto';

export class UpdateVideoRecordDto extends PartialType(CreateVideoRecordDto) {}
