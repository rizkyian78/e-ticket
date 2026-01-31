import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LedgerClient {
  constructor(private readonly http: HttpService) {}

  async postLedger(payload: any) {
    return firstValueFrom(this.http.post('http://127.0.0.1:9000', payload));
  }
}
