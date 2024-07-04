import { Injectable } from '@nestjs/common';
import { OnCompletedInterface } from './contract';

@Injectable()
export class OnCompletedServiceDefault implements OnCompletedInterface {
  async handle({ outputFile, fileId }): Promise<void> {}
}
