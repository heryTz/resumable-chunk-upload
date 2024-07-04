import {
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
} from '@nestjs/common';
import { RCUConfig } from 'rcu-back-core';

export interface OnCompletedInterface {
  handle: (data: { outputFile: string; fileId: string }) => Promise<void>;
}

export type RCUServiceNestConfig = Required<
  Pick<RCUConfig, 'store' | 'tmpDir' | 'outputDir'>
> & {
  onCompleted: OnCompletedInterface | null;
};

export type RCUModuleConfig = Omit<RCUServiceNestConfig, 'onCompleted'> & {
  onCompletedService: new (...args: any) => OnCompletedInterface;
  providers?: Provider[];
  imports?: (
    | Type<any>
    | DynamicModule
    | Promise<DynamicModule>
    | ForwardReference<any>
  )[];
};
