/**
 * This class contains ....
 *
 * @author Anthony, Chris, Logan
 * @see ../entities/Vote.ts; ../routes/VoteRoute.ts;
 * @since 0.0.1
 */
import { Vote } from "../entities/Vote";
import { AuthRequest } from "../types/types";
import { Response } from "express";
import { getManager } from "typeorm";

// vote controller

export const didIVote = async (req: AuthRequest, res: Response) => {
  const { id } = req.query;

  if (!id) {
    return res.send(false);
  }

  const result = await getManager().query(
    `select * from user_voted_in_election u where "u"."electionId" = $1 and "u"."userId" = $2`,
    [Number(id), req.user.id]
  );

  res.send(result.length === 1);
};

export const placeVote = async (req: AuthRequest, res: Response) => {
  const { votes } = req.body;

  try {
    await getManager().insert(Vote, votes as Vote[]);
    await getManager().query(
      `insert into user_voted_in_election values($1, $2)`,
      [req.user.id, votes[0].election]
    );

    res.status(201).send({ message: "Vote successfully created" });
  } catch (error) {
    res.status(403).send({ error: "Problem voting" });
  }
};
