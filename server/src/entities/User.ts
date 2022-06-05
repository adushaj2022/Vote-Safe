import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Election } from "./Election";
import { Invite } from "./Invite";

/**
 * This class contains the User Object.
 *
 * @author Anthony Dushaj <https://github.com/adushaj2022>
 * @see ../controllers/UserController.ts; ../routes/UserRoute.ts
 * @since 0.0.1
 */

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: "date" })
  dateOfBirth!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  country!: string;

  @Column({ nullable: true })
  authToken!: string;

  @Column({ length: 10 })
  phoneNumber!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @OneToMany(() => Election, (election) => election.creator)
  electionsAdmin!: Election[];

  @OneToMany(() => Invite, (invite) => invite.inviter)
  invites!: Invite[];

  @OneToMany(() => Invite, (invite) => invite.invitee)
  invitee!: Invite[];

  @ManyToMany(() => Election, { cascade: true })
  @JoinTable()
  registeredFor!: Election[];

  @ManyToMany(() => Election, { cascade: true })
  @JoinTable()
  votedIn!: Election[];

  @Column({ type: "timestamp", default: () => "now()" })
  createdAt!: string;
}
