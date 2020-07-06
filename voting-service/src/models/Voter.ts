import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, Unique, OneToMany } from 'typeorm';
import { VotingSession } from './VotingSession';
import { Election } from './Election';
import { Vote } from './Vote';


@Entity()
@Unique(['login'])
@ObjectType()
export class Voter extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => String)
  @Column()
  login: string;

  @Field(() => [VotingSession])
  @ManyToMany(
    () => VotingSession,
    votingSession => votingSession.voters
  )
  votingSessions!: VotingSession[];

  @Field(() => [Election])
  @ManyToMany(
    () => Election,
    election => election.voters
  )
  elections!: Election[];

  @Field(() => [Vote])
  @OneToMany(
    () => Vote,
    vote => vote.voter
  )
  votes!: Vote[];

  constructor(firstName: string, lastName: string, login: string) {
    super();

    this.firstName = firstName;
    this.lastName = lastName;
    this.login = login;
  }

  get currentVotingSessions(): VotingSession[] {
    return this.votingSessions.filter((votingSession) => !votingSession.voterHasVoted(this))
  }
}
