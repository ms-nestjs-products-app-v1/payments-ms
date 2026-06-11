import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { Request, Response } from 'express';

import { envs, NATS_SERVICE } from 'src/config';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
  // Config Stripe
  private readonly stripeClient = new Stripe(envs.stripeSecretKey);

  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

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
        metadata: {
          orderId: orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    return {
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
      url: session.url,
    };
  }

  stripeWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature']!;

    let event: any;
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings at https://dashboard.stripe.com/webhooks
    const endpointSecret = envs.stripeEndpointSecret;

    try {
      event = this.stripeClient.webhooks.constructEvent(
        req['rawBody'],
        signature,
        endpointSecret,
      );
    } catch (err) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook error: ${err?.message}}`); // 400
      return;
    }

    switch (event.type) {
      case 'charge.succeeded': {
        const chargeSucceeded = event.data.object;
        const payload = {
          stripePaymentId: chargeSucceeded.id,
          orderId: chargeSucceeded.metadata.orderId,
          receiptUrl: chargeSucceeded.receipt_url,
        };

        // CALL ORDERS MICROSERVICE
        this.client.emit('payment.succeeded', payload);
        break;
      }
      default:
        console.log(`Event ${event.type} not handled`);
    }

    return res.status(HttpStatus.OK).json({ signature }); // 200
  }
}
