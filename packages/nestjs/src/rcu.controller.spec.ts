import { Test, TestingModule } from '@nestjs/testing';
import { RCUController } from './rcu.controller';
import { RCUServiceNest } from './rcu.service';
import { RCU_SERVICE_CONFIG, RCU_SERVICE_DEFAULT_CONFIG } from './constant';

describe('RCUController', () => {
  let appController: RCUController;

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

    appController = app.get<RCUController>(RCUController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
