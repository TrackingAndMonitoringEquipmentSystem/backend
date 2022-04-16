import { Injectable } from '@nestjs/common';
import * as faceapi from '@vladmandic/face-api/dist/face-api.node.js';
import * as tf from '@tensorflow/tfjs-node';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class FaceRecognitionService {
    private faceMatcher: faceapi.FaceMatcher;
    constructor() {
        this.initialFaceApi();
    }
    async initialFaceApi(): Promise<void> {
        const modelPath = path.resolve(__dirname, '../assets/models');
        await faceapi.tf.setBackend("tensorflow");
        await faceapi.tf.enableProdMode();
        await faceapi.tf.ENV.set("DEBUG", false);
        await faceapi.tf.ready();
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        const faceImagesPath = path.resolve(__dirname, '../assets/face-id');
        const referentFaces = [];
        const files = await fs.readdir(faceImagesPath);
        for (const fileName of files) {
            const file = await fs.readFile(path.join(faceImagesPath, fileName),);
            const image = await this.parseImage(file);
            const result = await faceapi
                .detectSingleFace(image)
                .withFaceLandmarks()
                .withFaceDescriptor();
            referentFaces.push(result);
        }
        this.faceMatcher = new faceapi.FaceMatcher(referentFaces, 0.6);
    }

    parseImage(file: any): any {
        const decoded = tf.node.decodeImage(file);
        const casted = decoded.toFloat();
        const result = casted.expandDims(0);
        decoded.dispose();
        casted.dispose();
        return result;
    }

    async validateFaceId(file: Buffer): Promise<any> {
        const image = await this.parseImage(file);
        const imageWithDescriptor = await faceapi
            .detectSingleFace(image)
            .withFaceLandmarks()
            .withFaceDescriptor();
        if (imageWithDescriptor) {
            return this.faceMatcher.findBestMatch(imageWithDescriptor.descriptor);
        } else {
            return { message: 'Face not found' };
        }
    }
}
