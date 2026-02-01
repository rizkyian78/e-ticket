import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LedgerClient {
  private readonly ledgerServiceUrl =
    this.config.get('LEDGER_SERVICE_URL') ?? 'http://127.0.0.1:9000';
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async postLedger(payload: any) {
    return firstValueFrom(
      this.http.post(`${this.ledgerServiceUrl}/api/ledger/entries`, payload),
    );
  }
}
