import { Field, ID, ObjectType, Int } from 'type-graphql';
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Voter } from './Voter';
import { VotingSession } from './VotingSession';

const VOTING_GROUP_SIZE = 10;

@Entity()
@ObjectType()
export class Election extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Field(() => Int)
  round: number = 0;

  @Field(() => [Voter])
  @ManyToMany(
    () => Voter,
    voter => voter.elections,
  )
  @JoinTable()
  voters: Voter[] = [];

  @Field(() => [VotingSession])
  @OneToMany(
    () => VotingSession,
    VotingSession => VotingSession.election
  )
  votingSessions!: VotingSession[];

  constructor(voters: Voter[]) {
    super();

    this.voters = voters;
  }

  async startElection(): Promise<boolean> {
    return this.startVotingRound();
  }

  async startVotingRound(): Promise<boolean> {
    if (!this.roundComplete) {
      return false;
    }

    const newVoters = this.currentVotingSessions.map((votingSession) => votingSession.winner!);

    if (newVoters.length % VOTING_GROUP_SIZE !== 0) {
      // Voter population sizes must be evenly divisible by VOTING_GROUP_SIZE
      return false;
    }

    this.round++;

    const newVotingSessions = [];

    for (let i = 0; i < newVoters.length; i += VOTING_GROUP_SIZE) {
      const votingSession = new VotingSession(newVoters.slice(i, i + VOTING_GROUP_SIZE), this, this.round);
      newVotingSessions.push(votingSession.save());
    }

    await Promise.all(newVotingSessions);
    await this.save();

    return true;
  }

  get currentVotingSessions(): VotingSession[] {
    return this.votingSessions.filter((votingSession) => votingSession.round === this.round);
  }

  get currentVoters(): Voter[] {
    if (!this.currentVotingSessions.length) {
      return this.voters;
    }

    return this.currentVotingSessions.flatMap((votingSession) => votingSession.voters);
  }

  get roundComplete(): boolean {
    return this.currentVotingSessions.every((votingSession) => votingSession.winner);
  }

  get isActive(): boolean {
    return this.round > 0;
  }

  registerVoters(voters: Voter[]): boolean {
    if (this.isActive) {
      // Cannot add voters to an active election
      return false;
    }

    if (!this.voters) {
      this.voters = [];
    }

    this.voters.push(...voters);
    this.save();

    return false;
  }
}
