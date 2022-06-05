// Extend process.env to include our custom env variables and get type defs for them
declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: number;
    USER: string;
    HOST: string;
    PASSWORD: string;
    DATABASE_PORT: number;
    SECRET_KEY: string;
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_CHANNEL_CODE: string;
    REDIS_SECRET: string;
    STRIPE_SK_KEY: string;
    ENDPOINT_SECRET: string;
  }
}
