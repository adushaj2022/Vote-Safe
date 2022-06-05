import { Response } from "express";
import { getManager } from "typeorm";
import { Candidate } from "../entities/Candidate";
import { Election } from "../entities/Election";
import { User } from "../entities/User";
import { AuthRequest } from "../types/types";
import { upload } from "../util/Storage";

/**
 * This class creates and gets Candidates for the API route.
 *
 * @author Anthony, Chris, Logan
 * @see ../entities/Candidate.ts; ../routes/CandidateRoute.ts
 * @since 0.0.1
 */

// Body must contain candidate name, category, electionId and optionally img_url and description
export async function createCandidate(req: AuthRequest, res: Response) {
  upload(req, res, async (err: any) => {
    if (err) {
      return res.status(402).send(err);
    }

    const name = req.body?.name;
    const category = req.body?.category;
    const election = <any>req.body?.electionId;
    const description = req.body?.description;
    const imgUrl = req.file?.filename ?? "default.png";

    if (!name || !category || !description || !imgUrl) {
      return res.send({ error: "all fields must be entered" });
    }

    try {
      const candidate = Candidate.create();
      candidate.name = name;
      candidate.category = category;
      candidate.election = election;
      candidate.description = description;
      candidate.imgUrl = imgUrl ?? "default.png";
      await candidate.save();
      res.status(201).send({ candidate });
    } catch (error) {
      res.status(400).send({ error: "Something went wrong" });
    }
  });
}

/*
    QUERY PARAMS:
        electionId: Pass election id, receive candidaes
        category: Grab specific categorys
*/
export async function getElectionsCandidate(req: AuthRequest, res: Response) {
  const electionId = req.query.electionId;
  const category = req.query.category;

  if (electionId === null || typeof electionId === "undefined") {
    return res.send({ electionCandidates: null });
  }
  const electionCandidates = await Candidate.find({
    where: {
      election: electionId,
      ...(category && { category }),
    },
  });

  let allCategories = await Candidate.find({
    select: ["category"],
    where: {
      election: electionId,
      ...(category && { category }),
    },
  });

  // grab distinct categories
  let result = new Set<string>();
  for (let c of allCategories) {
    result.add(c.category);
  }

  res.status(200).send({ electionCandidates, allCategories: [...result] });
}
