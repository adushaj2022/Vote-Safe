import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Candidate } from "./Candidate";
import { Election } from "./Election";

/**
 * This class contains the Vote Object.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../controllers/VoteController.ts;
 * @since 0.0.1
 */

@Entity()
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Candidate, (candidate) => candidate.votes)
  candidate!: Candidate;

  @ManyToOne(() => Election, (election) => election.votes)
  election!: Election;
}
