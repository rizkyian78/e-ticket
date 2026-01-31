import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InquiryRequest } from 'src/dto/inquiry.dto';
import { InquiriesService } from '../../services/inquiries/inquiries.service';

@Controller('inquiry')
export class InquiryController {
  constructor(private readonly inquiriesService: InquiriesService) {}
  @Post('submit')
  async createInquiry(@Body() body: InquiryRequest) {
    return this.inquiriesService.createInquiry(body);
  }

  @Get('/:id')
  async findOneInquiry(@Param('id') id: string) {
    return this.inquiriesService.findOne(id);
  }
}
