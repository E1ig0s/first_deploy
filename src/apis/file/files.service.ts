import { Injectable } from '@nestjs/common';
import { IFilesServiceUpload } from './interfaces/files-service.interface';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
    async upload({ file }: IFilesServiceUpload): Promise<string> {
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID,
            keyFilename: 'gcp-file-storage.json',
        });

        const bucketName = 'service-image-storage';

        const filename = `${uuidv4()}_${file.filename}`;
        const bucket = storage.bucket(bucketName);
        const fileUpload = bucket.file(filename);

        await new Promise((resolve, reject) => {
            file.createReadStream()
                .pipe(fileUpload.createWriteStream())
                .on('error', (error) => {
                    reject(error);
                })
                .on('finish', async () => {
                    resolve('Upload complete');
                });
        });

        return `https://storage.googleapis.com/${bucketName}/${filename}`;
    }
}
