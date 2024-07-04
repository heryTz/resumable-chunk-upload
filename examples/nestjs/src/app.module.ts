import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonStoreProvider, RCUModule } from 'rcu-nestjs';
import { LoggingService } from './logging.service';
import { OnCompletedService } from './on-completed.service';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    RCUModule.forRoot({
      store: new JsonStoreProvider('./tmp/rcu.json'),
      tmpDir: './tmp',
      outputDir: './tmp',
      onCompletedService: OnCompletedService,
      providers: [LoggingService, OnCompletedService],
    }),
  ],
})
export class AppModule {}
