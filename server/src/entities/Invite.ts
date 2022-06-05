import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Election } from "./Election";
import { User } from "./User";

/**
 * This class contains the Invite Object.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../controllers/InviteController.ts; ../routes/InviteRoute.ts
 * @since 0.0.1
 */

@Entity()
export class Invite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.invites)
  inviter!: User;

  @ManyToOne(() => User, (user) => user.invitee)
  invitee!: User;

  @ManyToOne(() => Election, (election) => election.invites)
  election!: Election;
}
