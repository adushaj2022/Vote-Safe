import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Candidate } from "./Candidate";
import { Invite } from "./Invite";
import { User } from "./User";
import { Vote } from "./Vote";

/** 
  * This class contains the Election Object. 
  * 
  * @author Anthony Dushaj <https://github.com/adushaj2022> 
  * @see ../controllers/ElectionController.ts; ../routes/ElectionRoute.ts 
  * @since 0.0.1 
  */ 

@Entity()
export class Election extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.electionsAdmin)
  creator!: User;

  @Column()
  description!: string;

  @Column({ type: "date" })
  openDate!: string;

  @Column({ type: "date" })
  closeDate!: string;

  @OneToMany(() => Candidate, (candidate) => candidate.election)
  candidates!: Candidate[];

  @OneToMany(() => Vote, (vote) => vote.election)
  votes!: Vote[];

  @OneToMany(() => Invite, (invite) => invite.election)
  invites!: Invite[];

  @Column({ type: "timestamp", default: () => "now()" })
  createdAt!: string;
}
