import { Injectable } from '@nestjs/common';
import * as faceapi from '@vladmandic/face-api';
import * as tf from '@tensorflow/tfjs-node';
import * as path from 'path';
import * as fs from 'fs/promises';
import { LockersService } from 'src/lockers/lockers.service';

@Injectable()
export class FaceRecognitionService {
  private faceMatcher: faceapi.FaceMatcher;
  constructor(private lockersService: LockersService) {
    this.initialFaceApi();
  }
  async initialFaceApi(): Promise<void> {
    const modelPath = path.resolve(__dirname, '../assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    const faceImagesPath = path.resolve(__dirname, '../assets/face-id');
    const referentFaces = [];
    const files = await fs.readdir(faceImagesPath);
    for (const fileName of files) {
      const file = await fs.readFile(path.join(faceImagesPath, fileName));
      const image = await this.parseImage(file);
      const result = await faceapi
        .detectSingleFace(image)
        .withFaceLandmarks()
        .withFaceDescriptor();
      referentFaces.push(
        new faceapi.LabeledFaceDescriptors(fileName, [result.descriptor]),
      );
    }
    this.faceMatcher = new faceapi.FaceMatcher(referentFaces, 0.7);
  }

  parseImage(file: any): any {
    const decoded = tf.node.decodeImage(file);
    const casted = decoded.toFloat();
    const result = casted.expandDims(0);
    decoded.dispose();
    casted.dispose();
    return result;
  }

  async validateFaceId(file: Buffer, lockerId: number): Promise<any> {
    const image = await this.parseImage(file);

    const imageWithDescriptor = await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (imageWithDescriptor) {
      const result = this.faceMatcher.findBestMatch(
        imageWithDescriptor.descriptor,
      );
      if (result) {
        try {
          console.log('->result._label:', result.label);
          if (result.label == 'unknown') {
            return { message: 'Not Had Permission' };
          }
          const checkPermission = await this.lockersService.validateFaceID(
            { fileName: result.label },
            lockerId.toString(),
          );
          if (checkPermission.successful) {
            return { message: 'Granted', userId: result.label.split('.')[0] };
          } else {
            return { message: 'Not Had Permission' };
          }
        } catch (error) {
          console.error('error:', error);
          return { message: 'Not Had Permission' };
        }
      } else {
        return { message: 'Face not found' };
      }
    } else {
      return { message: 'Face not found' };
    }
  }
}
