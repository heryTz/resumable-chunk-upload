import { Injectable } from '@nestjs/common';
import { OnCompletedInterface } from 'rcu-nestjs';
import { LoggingService } from './logging.service';

@Injectable()
export class OnCompletedService implements OnCompletedInterface {
  constructor(private loggingService: LoggingService) {}

  handle = async ({ outputFile, fileId }) => {
    this.loggingService.log('File completed: ' + fileId);
  };
}
