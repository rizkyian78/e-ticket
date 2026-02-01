import { Merchant } from './../../model/merchants.model';
import { Inject, Injectable } from '@nestjs/common';
import { MODELS } from 'src/providers/database.module';

import { MerchantsRepository } from '../merchantsinterface.repository';

@Injectable()
export class SequelizeMerchantRepository implements MerchantsRepository {
  constructor(
    @Inject(MODELS)
    private readonly models: {
      Merchant: typeof Merchant;
    },
  ) {}
  findByApiKey(api_key: string): Promise<Merchant> {
    return this.models.Merchant.findOne({ where: { api_key: api_key } });
  }
}
