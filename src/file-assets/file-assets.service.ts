import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { readFileSync, writeFileSync } from "fs";
import path from "path";

@Injectable()
export class FileAssetsService {
    saveImage(imagebase64: string) {
        const image = Buffer.from(imagebase64, 'base64');
        const name = uuidv4();
        const fileName = name + '.jpg'
        writeFileSync(`./src/file-assets/${fileName}`, image);
        return fileName;
    }
    // convertFileName(data: string) {
    //     const image = Buffer.from(data, 'base64');
    //     const name = uuidv4();
    //     const fileName = name + '.jpg'
    //     writeFileSync(`./src/file-assets/${fileName}`, image);
    //     const payload = { fileName: fileName };
    //     return payload;
    //     // return (uuidv4(name));
    // }
}