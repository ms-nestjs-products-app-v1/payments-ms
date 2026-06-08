import { HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { Request, Response } from 'express';

import { envs } from 'src/config';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
  // Config Stripe
  private readonly stripeClient = new Stripe(envs.stripeSecretKey);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items } = paymentSessionDto;

    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: item.name, // Nombre del item
          },
          unit_amount: Math.round(item.price * 100), // Equivale a $20 (2000 / 100 = 20.00)
        },
        quantity: item.quantity, // Cantidad de items
      };
    });

    // Crea un objeto de sesión de pago
    const session = await this.stripeClient.checkout.sessions.create({
      // Agregar el ID de la orden
      payment_intent_data: {
        metadata: {},
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3003/payments/success',
      cancel_url: 'http://localhost:3003/payments/cancel',
    });

    return session;
  }

  stripeWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'];
    console.log({ signature });

    return res.status(HttpStatus.OK).json({ signature }); // 200
  }
}
