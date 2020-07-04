import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Voter } from './Voter';
import { Election } from './Election';


@Entity()
@ObjectType()
export class VotingSession extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @ManyToMany(
    type => Voter,
    voter => voter.votingSessions
  )
  @JoinTable()
  voters: Voter[];

  @ManyToMany(
    type => Voter,
    voter => voter.votingSessions
  )
  @JoinTable()
  candidates: Voter[];

  @ManyToOne(
    type => Election,
    election => election.votingSessions
  )
  election: Election;

  constructor(voters: Voter[], election: Election) {
    super();

    this.voters = voters;
    this.candidates = voters;
    this.election = election;
  }
}
