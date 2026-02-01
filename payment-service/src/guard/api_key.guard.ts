import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SequelizeMerchantRepository } from 'src/repository/impl/merchantinterfaceimpl.repository';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject('MerchantRepository')
    private readonly merchantRepo: SequelizeMerchantRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      throw new UnauthorizedException('Invalid authorization');
    }

    const merchant = await this.merchantRepo.findByApiKey(apiKey);

    if (!merchant) {
      throw new UnauthorizedException('Invalid authorization');
    }

    if (merchant.status !== 'active') {
      throw new UnauthorizedException('Unexistent or inactive partner');
    }

    request.merchant = merchant;

    return true;
  }
}
