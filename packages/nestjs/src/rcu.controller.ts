import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RCUServiceNest } from './rcu.service';
import { UploadStatusQueryDto } from './dto/upload-status-query.dto';
import { UploadDto } from './dto/upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class RCUController {
  constructor(private readonly service: RCUServiceNest) {}

  @HttpCode(200)
  @Get('/uploadStatus')
  @UsePipes(new ValidationPipe({ transform: true }))
  async uploadStatus(@Query() query: UploadStatusQueryDto) {
    return this.service.uploadStatus(query);
  }

  @HttpCode(200)
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async upload(
    @Body() dto: UploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.upload({ ...dto, file: file.buffer });
  }
}
