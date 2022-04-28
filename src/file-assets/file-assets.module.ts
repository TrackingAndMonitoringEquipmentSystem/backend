import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { FileAssetsController } from "./file-assets.controller";
import { FileAssetsService } from "./file-assets.service";

@Module({
    controllers: [FileAssetsController],
    providers: [FileAssetsService],
    exports: [FileAssetsService],
})
export class FileAssetsModule { }