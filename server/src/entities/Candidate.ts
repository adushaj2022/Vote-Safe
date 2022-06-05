import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Election } from "./Election";
import { Vote } from "./Vote";

/**
 * This class contains the Candidate Object.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../controllers/CandidateController.ts; ../routes/CandidateRoute.ts
 * @since 0.0.1
 */

@Entity()
export class Candidate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  category!: string; // position

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  party!: string;

  @Column({ default: "default.png" })
  imgUrl!: string;

  @ManyToOne(() => Election, (election: Election) => election.candidates)
  election!: Election;

  @OneToMany(() => Vote, (vote) => vote.candidate)
  votes!: Vote[];

  @Column({ type: "timestamp", default: () => "now()" })
  createdAt!: string;
}
