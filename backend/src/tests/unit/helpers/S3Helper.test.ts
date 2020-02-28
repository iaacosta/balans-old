import { S3 } from 'aws-sdk';
import { PassThrough } from 'stream';
import S3Helper from '../../../utils/S3Helper';

let upload: jest.Mock;
let deleteObject: jest.Mock;

jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    upload,
    deleteObject,
  })),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => '12345'),
}));

jest.mock('stream', () => ({
  PassThrough: jest.fn(),
}));

describe('S3Helper unit test', () => {
  beforeEach(() => {
    upload = jest.fn((dummy, cb) => cb(null));
    deleteObject = jest.fn((dummy, cb) => cb(null));

    jest.resetModules();
    process.env = {
      S3_URL: 'S3_URL',
      IAM_ID: 'IAM_ID',
      IAM_SECRET: 'IAM_SECRET',
    };
  });

  afterEach(() => ((S3 as unknown) as jest.Mock).mockClear());

  it('should create S3Helper object', () =>
    expect(new S3Helper()).not.toBeFalsy());

  it('should try to create a client correctly', () => {
    (() => new S3Helper())();
    expect(S3).toHaveBeenCalledTimes(1);
    expect(S3).toHaveBeenCalledWith({
      accessKeyId: 'IAM_ID',
      secretAccessKey: 'IAM_SECRET',
    });
  });

  describe('uploadFile', () => {
    let pipe: jest.Mock;

    beforeEach(() => {
      pipe = jest.fn();
    });

    afterEach(() => pipe.mockClear());

    it('should call upload with correct arguments if invoked', async () => {
      const helper = new S3Helper();
      await helper.uploadFile('image/png', { pipe } as any);
      expect(upload).toHaveBeenCalledTimes(1);
      expect(upload).toHaveBeenCalledWith(
        {
          Bucket: 'finanzie-photos',
          ACL: 'public-read',
          Key: '12345',
          Body: new PassThrough(),
        },
        expect.anything(),
      );
    });

    it('should call pipe with the pass mock if invoked', async () => {
      const helper = new S3Helper();
      await helper.uploadFile('image/png', { pipe } as any);
      expect(pipe).toHaveBeenCalledTimes(1);
      expect(pipe).toHaveBeenCalledWith(new PassThrough());
    });

    it('should resolve to correct URL with "random" name', async () => {
      const helper = new S3Helper();
      const uri = await helper.uploadFile('image/png', { pipe } as any);
      expect(uri).toBe('S3_URL/12345');
    });

    it('should resolve to correct URL with given name', async () => {
      const helper = new S3Helper();
      const uri = await helper.uploadFile(
        'image/jpeg',
        { pipe } as any,
        'example',
      );
      expect(uri).toBe('S3_URL/example');
    });

    it('should reject if upload throws an error', () => {
      upload.mockImplementation((dummy, cb) => cb('error'));
      const helper = new S3Helper();
      expect(
        helper.uploadFile('image/png', { pipe } as any),
      ).rejects.toBeTruthy();
    });

    it('should reject if mimetype is invalid', () => {
      const helper = new S3Helper();
      expect(
        helper.uploadFile('invalid/type', { pipe } as any),
      ).rejects.toBeTruthy();
    });
  });

  describe('removeFile', () => {
    it('should call deleteObject with correct arguments if invoked removeFile', async () => {
      const helper = new S3Helper();
      await helper.removeFile('S3_URL/fileName');
      expect(deleteObject).toHaveBeenCalledTimes(1);
      expect(deleteObject).toHaveBeenCalledWith(
        {
          Bucket: 'finanzie-photos',
          Key: 'fileName',
        },
        expect.anything(),
      );
    });

    it('should reject if deleteObject throws an error', () => {
      deleteObject.mockImplementation((dummy, cb) => cb('error'));
      const helper = new S3Helper();
      expect(helper.removeFile('S3_URL/fileName')).rejects.toBeTruthy();
    });
  });
});
