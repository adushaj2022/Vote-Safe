import { Response } from "express";
import { getManager } from "typeorm";
import { Invite } from "../entities/Invite";
import { AuthRequest } from "../types/types";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { uuid } from "uuidv4";
import { RedisClient } from "redis";

/**
 * This class creates Invites sent by users,
 * allows user acceptance and a list view of them
 * for the API route.
 *
 * @author Anthony, Chris, Logan
 * @see ../entities/Invite.ts; ../routes/InviteRoute.ts;
 * @since 0.0.1
 */

// Body must contain inviteeId as well as electionId
export async function inviteUser(req: AuthRequest, res: Response) {
  const invite = new Invite();
  const io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap> =
    req.app.get("socketio");
  try {
    invite.election = <any>req.body.electionId;
    invite.inviter = <any>req.user.id;
    invite.invitee = req.body.invitee;
    await invite.save();

    // lets try this out on wednesday, for live notifications
    io.to(req.user.id + "").emit("invite_notification", {
      invite,
    });
  } catch (error) {
    res.status(400).send({ error: "Problem inviting" });
  }

  res.status(201).send({ invite });
}

export async function viewUserInvites(req: AuthRequest, res: Response) {
  const myInvites = await Invite.find({
    relations: ["election", "inviter"],
    where: { invitee: req.user.id },
  });
  res.send({ myInvites });
}

// Accept invite really means registering, and also removing that invite.
// Params must include invite Id and electionId. The frontend will contain a list of invites, when a user clicks, send with req
export async function acceptInvite(req: AuthRequest, res: Response) {
  const inviteId = req.body.inviteId;
  const electionId = req.body.electionId;
  const userId = req.user.id;

  const invite = await Invite.findOne(inviteId, { relations: ["invitee"] });
  // Make sure the invite being accepted, is for the right user
  if (!invite || invite?.invitee.id !== userId) {
    return res.send({
      error: "Sorry, you do not have any invites for this election",
    });
  }

  try {
    // register for that election
    await getManager().query(
      `insert into user_registered_for_election values($1, $2)`,
      [userId, electionId]
    );

    await Invite.remove(invite);
    res.status(201).send(true);
  } catch (error) {
    res.status(400).send({ error });
  }
}

export async function rejectInvite(req: AuthRequest, res: Response) {
  const { id } = req.body;

  const invite = await Invite.findOne(id);
  if (!invite) {
    return res.status(400).send({ message: "no invite found" });
  }

  try {
    await invite.remove();
  } catch (error) {
    return res.status(400).send({ error: "problem deleting invite" });
  }

  res.send({ message: "invite successfully deleted" });
}

// Body will include electionId and inviteeId, we will return if they have been invited already || or if they registered
export async function isUserInvited(req: AuthRequest, res: Response) {
  const { electionId, invitee } = req.query;

  let result = false;
  const invRecord = await Invite.findOne({
    where: { election: electionId, invitee },
  });

  if (invRecord) {
    result = true;
  }

  const isRegistered = await getManager().query(
    `select * from user_registered_for_election u where "u"."electionId" = $1 and "u"."userId" = $2`,
    [electionId, invitee]
  );

  if (Array.isArray(isRegistered) && isRegistered.length > 0) {
    result = true;
  }

  res.send(result);
}

/**
 * Invite via URL
 */

export async function sendInviteByUrl(req: AuthRequest, res: Response) {
  const uniqueInviteToken = uuid();
  const electionId = req.body?.electionId;
  const redisClient: RedisClient = req.app.get("redis");

  // the key will equal the electionId followed by "e" -> "4e", this is so we dont get confused by other vals in redis
  redisClient.get(electionId + "e", (error, tokens) => {
    if (!error) {
      // start off with a one element new array of the new token
      let newVal: any = JSON.stringify([uniqueInviteToken]);
      // if we have previous tokens, lets create a new array of the old tokens and the new token
      if (tokens) {
        let myTokens = JSON.parse(tokens as string);
        // js way of creating a new array and spreading out the old values in addition to new one
        newVal = [...myTokens, uniqueInviteToken];
      }

      // store the new tokens in the db
      redisClient.set(electionId + "e", JSON.stringify(newVal), (e, rep) => {
        if (rep === "OK") {
          return res.status(201).send(newVal);
        }

        return res.status(400).send(false);
      });
    }
  });
}
