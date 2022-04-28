import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync } from "fs";
import path from "path";

@Injectable()
export class FileAssetsService {
    saveImage(imagebase64: string) {
        const image = Buffer.from(imagebase64, 'base64');
        const name = uuidv4();
        const imagesPath = path.resolve(__dirname, `../file-assets/face-id/${name}.jpg`);
        writeFileSync(imagesPath, image);
        return imagesPath;
    }

    saveFaceeId(imagebase64: string, userId: number) {
        const image = Buffer.from(imagebase64, 'base64');
        const imagesPath = path.resolve(__dirname, `../file-assets/face-id/${userId}.jpg`);
        writeFileSync(imagesPath, image);
        return imagesPath;
    }
}