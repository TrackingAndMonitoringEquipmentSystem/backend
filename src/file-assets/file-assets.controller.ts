import { Controller } from '@nestjs/common';

import { FileAssetsService } from './file-assets.service';

@Controller('assets')
export class FileAssetsController {
  constructor(private fileAssetsService: FileAssetsService) {}
}
