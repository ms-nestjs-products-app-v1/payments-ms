import 'dotenv/config';
import Joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_SECRET_KEY: string;
}

const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
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
};
