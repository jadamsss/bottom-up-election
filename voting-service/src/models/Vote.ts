import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, Unique } from 'typeorm';
import { VotingSession } from './VotingSession';
import { Election } from './Election';
import { Voter } from './Voter';


@Entity()
@Unique(['voter', 'votingSession'])
@ObjectType()
export class Vote extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @ManyToOne(
    type => Voter,
    voter => voter.votes
  )
  @JoinTable()
  voter: Voter;

  @ManyToOne(
    type => Voter,
    voter => voter.votes
  )
  candidate: Voter;

  @ManyToOne(
    type => VotingSession,
    votingSession => votingSession.votes
  )
  votingSession: VotingSession;

  constructor(voter: Voter, candidate: Voter, votingSession: VotingSession) {
    super();

    this.voter = voter;
    this.candidate = candidate;
    this.votingSession = votingSession;
  }
}
