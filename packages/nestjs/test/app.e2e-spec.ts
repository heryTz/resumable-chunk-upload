import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RCUModule } from '../src/rcu.module';
import { UploadDto } from '../src/dto/upload.dto';
import { RCUServiceNest } from '../src/rcu.service';
import { UploadStatusQueryDto } from '../src/dto/upload-status-query.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let rcuService: RCUServiceNest;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RCUModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    rcuService = moduleFixture.get<RCUServiceNest>(RCUServiceNest);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/uploadStatus (GET)', () => {
    it('should return status 200', () => {
      const query: UploadStatusQueryDto = {
        fileId: '123',
        chunkCount: 5,
      };

      jest.spyOn(rcuService, 'uploadStatus').mockImplementation(async () => ({
        lastChunk: 0,
      }));

      return request(app.getHttpServer())
        .get('/uploadStatus')
        .query(query)
        .expect(200);
    });

    it('should throw invalid parameter', () => {
      const query = {
        fileId: '123',
        chunkCount: 'xx',
      };

      jest.spyOn(rcuService, 'uploadStatus').mockImplementation(async () => ({
        lastChunk: 0,
      }));

      return request(app.getHttpServer())
        .get('/uploadStatus')
        .query(query)
        .expect(400);
    });
  });

  describe('/uploadStatus (POST)', () => {
    it('should return status 200', () => {
      const dto: UploadDto = {
        fileId: '123',
        chunkNumber: 1,
        originalFilename: 'file.txt',
        chunkCount: 5,
        chunkSize: 1024,
        fileSize: 5120,
      };

      jest.spyOn(rcuService, 'upload').mockImplementation(async () => ({
        message: 'Upload successful',
      }));

      return request(app.getHttpServer())
        .post('/upload')
        .field('fileId', dto.fileId)
        .field('chunkNumber', dto.chunkNumber)
        .field('originalFilename', dto.originalFilename)
        .field('chunkCount', dto.chunkCount)
        .field('chunkSize', dto.chunkSize)
        .field('fileSize', dto.fileSize)
        .attach('file', Buffer.from('test data'), 'file.txt')
        .expect(200);
    });

    it('sshould throw invalid parameter', () => {
      jest.spyOn(rcuService, 'upload').mockImplementation(async () => ({
        message: 'Upload successful',
      }));

      return request(app.getHttpServer())
        .post('/upload')
        .attach('file', Buffer.from('test data'), 'file.txt')
        .expect(400);
    });
  });
});
