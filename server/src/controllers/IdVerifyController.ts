import { Request, Response } from "express";
import { AuthRequest } from "../types/types";
import Stripe from "stripe";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
const stripe = new Stripe(process.env.STRIPE_SK_KEY, {
  apiVersion: "2020-08-27",
});

const endpointSecret = process.env.ENDPOINT_SECRET;

export const createSession = async (req: AuthRequest, res: Response) => {
  const session = await stripe.identity.verificationSessions.create({
    type: "document",
    options: {
      document: {
        require_matching_selfie: true,
      },
    },
  });

  res.json(session.url);
};

export const webhookHandler = async (
  request: AuthRequest,
  response: Response
) => {
  const sig = request.headers["stripe-signature"] as any;
  const io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> =
    request.app.get("socketio");
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err: any) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log(event.type);

  /**
   *  Things are a bit tricky here, since we are not the ones making this post request,
   *  (its stripe with their webhook), that means we cant alter the request or its body or headers
   *
   *  Problem: we are emitting a event inside of a post request here, and have no way of knowing who the notification should be sent to.
   *  It would be nice to add the socket id we are sending to, to the request body but because of what I stated above we cant.
   *  Cant add it is a session or cookie because it will not be attached to
   *  the request. We cant use a global variable either because it gets overridden
   *
   *
   *  Solution, emit all notifications to clients, but ignore ones that are not for client,
   *   information being sent is not sensitive, therefore there is nothing wrong with this approach
   *
   *   Deeper analysis, when client connects, send back their sid, client will hold sid in state.
   *   When listening, make sure event has same sid as client
   *
   *
   */

  const ids = await io.allSockets();
  for (let id of ids) {
    io.sockets.emit("notification", {
      sid: id,
      notification: event,
    });
  }

  // Handle the event
  switch (event.type) {
    case "identity.verification_session.canceled":
      // Then define and call a function to handle the event identity.verification_session.canceled
      break;
    case "identity.verification_session.created":
      // Then define and call a function to handle the event identity.verification_session.created
      break;
    case "identity.verification_session.processing":
      // Then define and call a function to handle the event identity.verification_session.processing
      break;
    case "identity.verification_session.redacted":
      // Then define and call a function to handle the event identity.verification_session.redacted
      break;
    case "identity.verification_session.requires_input":
      // Then define and call a function to handle the event identity.verification_session.requires_input
      break;
    case "identity.verification_session.verified":
      // Then define and call a function to handle the event identity.verification_session.verified
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send(true);
};
