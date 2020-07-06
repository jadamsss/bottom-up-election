import { Field, ID, ObjectType, Int } from 'type-graphql';
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

  @Field(() => Int)
  round: number;

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
    vote => vote.votingSession
  )
  votes!: Vote[];

  @Field(() => Voter)
  winner?: Voter

  constructor(voters: Voter[], election: Election, round: number) {
    super();

    this.voters = voters;
    this.candidates = voters;
    this.election = election;
    this.round = round;
  }

  voterHasVoted(voter: Voter): boolean {
    return !!this.votes.find((v) => v.id === voter.id);
  }

  vote(voter: Voter, candidate: Voter): boolean {
    const hasVoted = this.votes.filter((v) => v.voter.id === voter.id).length > 0;
    const candidateInvalid = this.candidates.find((candidate) => candidate.id === candidate.id) === undefined;

    if (hasVoted) {
      return false;
    }

    if (candidateInvalid) {
      return false;
    }

    Vote.create({ voter, candidate, votingSession: this })

    return true;
  }
}
