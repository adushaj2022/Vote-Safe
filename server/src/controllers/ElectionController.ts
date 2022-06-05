import { Response } from "express";
import { getManager } from "typeorm";
import { Election } from "../entities/Election";
import { User } from "../entities/User";
import { Vote } from "../entities/Vote";
import { AuthRequest } from "../types/types";
import { getRandomColor } from "../util/Random";

/**
 * This class creates and gets Elections created by users for the API route.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../entities/Election.ts; ../routes/ElectionRoute.ts;
 * @since 0.0.1
 */

// Body must receive values name, open date, close date, description
export async function newElection(req: AuthRequest, res: Response) {
  const name = req.body?.name;
  const description = req.body?.description;
  const openDate = req.body?.openDate;
  const closeDate = req.body?.closeDate;

  if (!name || !description || !openDate || !closeDate) {
    return res.send({ error: "all fields must be entered" });
  }

  if (Date.parse(openDate) > Date.parse(closeDate)) {
    return res.send({ error: "close date must be after open date" });
  }

  if (Date.parse(openDate) === Date.parse(closeDate)) {
    return res.send({
      error: "elections cant end and start on the same day (unfair)",
    });
  }

  const date = new Date();
  const today =
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

  if (
    Date.parse(openDate) < Date.parse(today) ||
    Date.parse(closeDate) < Date.parse(today)
  ) {
    return res.send({ error: "Date(s) can't be in the past" });
  }

  try {
    const election = Election.create(req.body as Election);
    election.creator = <any>req.user.id; // if this causes trouble, just run a query for curr user by id
    await election.save();
    res.status(201).send({
      creator: election.creator,
      name: election.name,
      id: election.id,
    });
  } catch (error) {
    res.send({ error: "Problem creating election" });
  }
}

export async function getElectionById(req: AuthRequest, res: Response) {
  const electionId = req.query.electionId as any;
  const myElection = await Election.findOne(electionId);
  res.status(200).send(myElection);
}

// Get elections a user created
export async function userGetElections(req: AuthRequest, res: Response) {
  try {
    const elections = await Election.find({
      where: { creator: req.user.id as any },
    });
    res.status(200).send({ elections });
  } catch (error) {
    res.send({ error: "Problem fetching elections" });
  }
}

export async function userRegisteredInElections(
  req: AuthRequest,
  res: Response
) {
  try {
    const registredElections = await getManager().query(
      `
    select "e".*
    from user_registered_for_election u
    join election e on "e"."id" = "u"."electionId"
    where "u"."userId" = $1
    `,
      [req.user.id]
    );
    res.send({ registredElections });
  } catch (error) {
    res.send({ error: "problem getting elections" });
  }
}

export async function electionResults(req: AuthRequest, res: Response) {
  let { id, category } = req.query;

  if (!id || !category) {
    return res.send({ error: "you must supply an election id" });
  }

  try {
    const votesPerCandidate = await getManager().query(
      `
        select
          count(v."candidateId") as votes,
          c.name
        from
          vote v
          join candidate c on c.id = v."candidateId"
        where
          v."electionId" = $1 and c.category = $2
        group by 2;
      `,
      [id, category]
    );

    let result = votesPerCandidate.map((c: any) => ({
      ...c,
      votes: Number(c.votes),
      color: getRandomColor(),
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));

    return res.status(200).send(result);
  } catch (error) {
    return res.status(400).send({ error: "problem fetching votes" });
  }
}

export async function electionStatus(req: AuthRequest, res: Response) {
  const { electionId }: any = req.query;
  const election = await Election.findOne(electionId);

  if (!election) {
    return res.send({ message: "no election exists" });
  }
  let message: boolean | string = false;
  if (Date.parse(election.closeDate) < new Date().valueOf()) {
    message = "election is over";
  } else if (Date.parse(election.openDate) > new Date().valueOf()) {
    message = "election has not started";
  }

  res.send({ message });
}
