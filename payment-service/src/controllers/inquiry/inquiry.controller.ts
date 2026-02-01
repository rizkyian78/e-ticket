import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InquiryRequestDto } from 'src/dto/inquiry.dto';
import { InquiriesService } from '../../services/inquiries/inquiries.service';
import { ApiKeyGuard } from 'src/guard/api_key.guard';

@Controller('api/inquiry/')
export class InquiryController {
  constructor(private readonly inquiriesService: InquiriesService) {}
  @Post('submit')
  @UseGuards(ApiKeyGuard)
  async createInquiry(@Body() body: InquiryRequestDto) {
    return this.inquiriesService.createInquiry(body);
  }

  @Get('/:id')
  async findOneInquiry(@Param('id') id: string) {
    return this.inquiriesService.findOne(id);
  }
}
