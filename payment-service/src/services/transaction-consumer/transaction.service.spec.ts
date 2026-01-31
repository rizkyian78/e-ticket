import { Test, TestingModule } from '@nestjs/testing';
import { TransactionConsumerService } from './transaction.service';

describe('TransactionConsumerService', () => {
  let service: TransactionConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionConsumerService],
    }).compile();

    service = module.get<TransactionConsumerService>(
      TransactionConsumerService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
