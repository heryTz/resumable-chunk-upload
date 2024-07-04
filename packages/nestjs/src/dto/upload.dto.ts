import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  Min,
  IsNotEmpty,
  IsPositive,
  MinLength,
} from 'class-validator';

export class UploadDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  fileId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  chunkNumber: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  originalFilename: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  chunkCount: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  chunkSize: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  fileSize: number;
}
