# PAYMENTS MICROSERVICE (Stripe & Webhook)

## NestJS

NestJS es un framework progresivo para desarrollar aplicaciones backend escalables usando Node.js y TypeSript.

### Microservices

Los microservicios en NestJS son una forma de construir aplaciones dividiendo el sistema en múltiples servicios pequeños, independientes y especializados que se comunican entre sí.

## Stripe

Stripe es una plataforma de pagos en línea que permite a empresas y desarrolladores aceptar pagos por internet de forma segura.

En pocas plabras:
Stripe = infraestructura para cobrar dinero digitalmente.

Con Stripe puedes aceptar:

- Tarjetas de créditos y débitos.
- Pagos móviles (Apple Pay, Goole Pay).
- Transferencias bancarias.
- Suscripciones recurrentes.
- Pagos internacionales en múltiples monedas.

### Webhook

En Stripe, un Webhook es un mecanismo mediante el cual Stripe envía automáticamente una notificación HTTP a tu servidor cuando ocurre un evento.

Ejemplos de eventos comunes:

- payment_intent.succeeded - pago exitoso.
- payment_intent.payment_failed - pago fallido.
- checkout.session.completed - checkout completado.
- customer.subscription.created - suscripción creada.
- customer.subscription.delted - suscripción cancelada.
