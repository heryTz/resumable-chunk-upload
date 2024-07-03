import { Test, TestingModule } from '@nestjs/testing';
import { RCUController } from './rcu.controller';
import { RCUServiceNest } from './rcu.service';
import { RCU_SERVICE_CONFIG, RCU_SERVICE_DEFAULT_CONFIG } from './constant';
import { UploadStatusQueryDto } from './dto/upload-status-query.dto';
import { UploadDto } from './dto/upload.dto';

describe('RCUController', () => {
  let rcuController: RCUController;
  let rcuService: RCUServiceNest;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RCUController],
      providers: [
        {
          provide: RCU_SERVICE_CONFIG,
          useValue: RCU_SERVICE_DEFAULT_CONFIG,
        },
        RCUServiceNest,
      ],
    }).compile();

    rcuController = app.get<RCUController>(RCUController);
    rcuService = app.get<RCUServiceNest>(RCUServiceNest);
  });

  describe('/uploadStatus', () => {
    it('should return the status of the upload', async () => {
      const query: UploadStatusQueryDto = { fileId: '123', chunkCount: 3 };
      const result = { lastChunk: 2 };

      jest.spyOn(rcuService, 'uploadStatus').mockResolvedValue(result);

      expect(await rcuController.uploadStatus(query)).toEqual(result);
    });
  });

  describe('/upload', () => {
    it('should upload a file chunk', async () => {
      const dto: UploadDto = {
        fileId: '123',
        chunkNumber: 1,
        originalFilename: 'test.txt',
        chunkCount: 3,
        chunkSize: 1024,
        fileSize: 3072,
      };
      const result = { message: 'Upload successful' };

      jest.spyOn(rcuService, 'upload').mockResolvedValue(result);

      expect(
        await rcuController.upload(dto, {
          buffer: Buffer.from('test content'),
        } as Express.Multer.File),
      ).toEqual(result);
    });
  });
});
