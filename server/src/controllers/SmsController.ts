import { Response } from "express";
import { AuthRequest } from "../types/types";
import twilio from "twilio";
import * as dotenv from "dotenv-safe";
dotenv.config({
  allowEmptyValues: true,
  example: "./.env",
});

/**
 * This class allows for the authentication of a new users phone number.
 *
 * @author Anthony, Chris, Logan
 * (Based on the doc here https://www.twilio.com/docs/verify/quickstarts/node-express)
 * @see ../routes/SmsRoute.ts
 * @since 0.0.1
 */

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* 
    sending code is pretty simple, provide a phone number 
    we also provide a channel code to specify our service
*/
export const sendVerificationCode = (req: AuthRequest, res: Response) => {
  const phoneNumber: string = req.body.phoneNumber;
  twilioClient.verify
    .services(process.env.TWILIO_CHANNEL_CODE)
    .verifications.create({ to: `+1${phoneNumber}`, channel: "sms" })
    .then((verification) => res.status(201).send(verification.status))
    .catch((err) => res.status(401).send(err));
};

/* 
    verify code, twilio does the action here, simply provide it the code,
    and we also need the number, but we grab it from the session.
    The response sends back a message: approved or not 
*/
export const verifyCode = (req: AuthRequest, res: Response) => {
  const code: string = req.body.code;
  const phoneNumber = req.body.phoneNumber;
  twilioClient.verify
    .services(process.env.TWILIO_CHANNEL_CODE)
    .verificationChecks.create({ to: `+1${phoneNumber}`, code })
    .then((verification_check) =>
      res.status(200).send(verification_check.status)
    )
    .catch((err) => res.status(401).send(err));
};
