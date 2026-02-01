import { Merchant } from 'src/model/merchants.model';

export interface MerchantsRepository {
  findByApiKey(id: string): Promise<Merchant>;
}
