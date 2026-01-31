import { Test, TestingModule } from '@nestjs/testing';
import { InquiryExpiryService } from './inquiry-expiry.service';

describe('InquiryExpiryService', () => {
  let service: InquiryExpiryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InquiryExpiryService],
    }).compile();

    service = module.get<InquiryExpiryService>(InquiryExpiryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
