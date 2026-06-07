import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { envs } from 'src/config';

@Injectable()
export class PaymentsService {
  // Config Stripe
  private readonly stripeClient = new Stripe(envs.stripeSecretKey);

  async createPaymentSession() {
    // Crea un objeto de sesión de pago
    const session = await this.stripeClient.checkout.sessions.create({
      // Agregar el ID de la orden
      payment_intent_data: {
        metadata: {},
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-Shirt', // Nombre del item
            },
            unit_amount: 2000, // Equivale a $20 (2000 / 100 = 20.00)
          },
          quantity: 2, // Cantidad de items
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel',
    });

    return session;
  }
}
