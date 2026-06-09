import 'dotenv/config';
import Joi from 'joi';

interface EnvVars {
  PORT: number;

  STRIPE_SECRET_KEY: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  STRIPE_ENDPOINT_SECRET: string;
}

const envsSchema = Joi.object({
  PORT: Joi.number().required(),

  STRIPE_SECRET_KEY: Joi.string().required(),
  STRIPE_SUCCESS_URL: Joi.string().required(),
  STRIPE_CANCEL_URL: Joi.string().required(),
  STRIPE_ENDPOINT_SECRET: Joi.string().required(),
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}}`);
}

// const envVars: EnvVars = value;
const envVars = value as EnvVars;

export const envs = {
  port: envVars.PORT,

  stripeSecretKey: envVars.STRIPE_SECRET_KEY,
  stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
  stripeEndpointSecret: envVars.STRIPE_ENDPOINT_SECRET,
};
