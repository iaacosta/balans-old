import { S3 } from 'aws-sdk';
import { FileUpload } from 'graphql-upload';
import { PassThrough } from 'stream';
import { v4 as uuid } from 'uuid';

export default class S3Helper {
  private client: S3;

  constructor() {
    this.client = new S3({
      accessKeyId: process.env.IAM_ID,
      secretAccessKey: process.env.IAM_SECRET,
    });
  }

  private static checkMimetype(mimetype: string) {
    switch (mimetype.split('/')[1]) {
      case 'jpeg':
      case 'png':
        return true;
      default:
        throw new Error('mimetype not permitted');
    }
  }

  public async uploadFile(
    mimetype: string,
    stream: ReturnType<FileUpload['createReadStream']>,
    fileName?: string,
  ): Promise<string> {
    S3Helper.checkMimetype(mimetype);
    const _fileName = `${fileName || uuid()}`;

    return new Promise((resolve, reject) => {
      const pass = new PassThrough();

      const params = {
        Bucket: 'finanzie-photos',
        ACL: 'public-read',
        Key: _fileName,
        Body: pass,
      };

      this.client.upload(params, (err: any) => {
        if (err) reject(err);
        resolve(`${process.env.S3_URL}/${_fileName}`);
      });

      stream.pipe(pass);
    });
  }

  public async removeFile(uri: string): Promise<boolean> {
    const fileName = uri.split(`${process.env.S3_URL}/`)[1];
    return new Promise((resolve, reject) =>
      this.client.deleteObject(
        { Bucket: 'finanzie-photos', Key: fileName },
        (err: any) => {
          if (err) reject(err);
          resolve(true);
        },
      ),
    );
  }
}
