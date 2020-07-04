import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Voter } from './Voter';
import { Election } from './Election';
import { Vote } from './Vote';


@Entity()
@ObjectType()
export class VotingSession extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Field(() => [Voter])
  @ManyToMany(
    () => Voter,
    voter => voter.votingSessions
  )
  @JoinTable()
  voters: Voter[];

  @Field(() => [Voter])
  @ManyToMany(
    () => Voter,
    voter => voter.votingSessions
  )
  @JoinTable()
  candidates: Voter[];

  @Field(() => Election)
  @ManyToOne(
    () => Election,
    election => election.votingSessions
  )
  election: Election;

  @Field(() => [Vote])
  @OneToMany(
    () => Vote,
    vote => vote.voter
  )
  votes!: Vote[];

  constructor(voters: Voter[], election: Election) {
    super();

    this.voters = voters;
    this.candidates = voters;
    this.election = election;
  }
}
