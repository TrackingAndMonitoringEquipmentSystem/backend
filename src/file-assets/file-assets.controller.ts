import { Body, Controller, Get, Param, Res, } from "@nestjs/common";
import { Response } from "express";
import { createReadStream } from "fs";
import { join } from "path";
import { FileAssetsService } from "./file-assets.service";

@Controller('assets')
export class FileAssetsController {
  constructor(private fileAssetsService: FileAssetsService) { }


}