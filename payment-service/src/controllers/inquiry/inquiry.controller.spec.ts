import { Test, TestingModule } from '@nestjs/testing';
import { InquiryController } from './inquiry.controller';
import { InquiriesService } from '../../services/inquiries/inquiries.service';
import { InquiryRequest } from 'src/dto/inquiry.dto';

describe('InquiryController', () => {
  let controller: InquiryController;
  let service: InquiriesService;

  const mockInquiriesService = {
    createInquiry: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InquiryController],
      providers: [
        {
          provide: InquiriesService,
          useValue: mockInquiriesService,
        },
      ],
    }).compile();

    controller = module.get<InquiryController>(InquiryController);
    service = module.get<InquiriesService>(InquiriesService);
    jest.clearAllMocks();
  });

  // ============================
  // createInquiry()
  // ============================

  it('should forward request to service and return response', async () => {
    const body: InquiryRequest = {
      amount: '300000' as any,
      ticket_id: 'TICKET-1',
      reference_id: 'REF-1',
      currency: 'IDR',
      customer: {
        name: 'Rizky',
        email: 'rizky@mail.com',
        phoneNumber: '+6281',
      },
      order: [
        {
          ticket_id: 'asd',
          ticket_code: 'VIP',
          reserving_quota: 2,
          amount: '150000' as any,
        },
      ],
    };

    const serviceResponse = {
      id: 'uuid-1',
      createdTime: new Date('2026-01-01'),
      referenceId: 'REF-1',
      status: 'PENDING',
      amount: '300000',
      currency: 'IDR',
      paymentSources: ['banktransfer', 'qris', 'creditcard', 'debitcard'],
      urls: {
        selections: 'http://localhost:3000/inquiry/uuid-1',
        checkout: 'http://localhost:3000/inquiry/uuid-1',
      },
    };

    mockInquiriesService.createInquiry.mockResolvedValue(serviceResponse);

    const result = await controller.createInquiry(body);

    // Assertions
    expect(service.createInquiry).toHaveBeenCalledTimes(1);
    expect(service.createInquiry).toHaveBeenCalledWith(body);
    expect(result).toEqual(serviceResponse);
  });

  it('should propagate errors from service', async () => {
    mockInquiriesService.createInquiry.mockRejectedValue(
      new Error('Service failure'),
    );

    const body = {} as InquiryRequest;

    await expect(controller.createInquiry(body)).rejects.toThrow(
      'Service failure',
    );
  });
});
