import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { envs } from 'src/config';

@Injectable()
export class PaymentsService {
  // Config Stripe
  private readonly stripeClient = new Stripe(envs.stripeSecretKey);
}
