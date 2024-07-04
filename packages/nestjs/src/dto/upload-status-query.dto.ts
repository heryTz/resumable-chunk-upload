import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UploadStatusQueryDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  chunkCount: number;
}
