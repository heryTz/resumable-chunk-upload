import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RCUModule } from 'rcu-nestjs';

@Module({
  imports: [RCUModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
