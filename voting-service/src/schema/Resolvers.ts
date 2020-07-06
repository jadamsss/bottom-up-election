import { ID, Query, Resolver, Arg, Mutation } from 'type-graphql';
import { Election, Voter, VotingSession, Vote } from '../models';

@Resolver()
export class Resolvers {
  // Queries
  @Query(() => [ Election ])
  async allElections(): Promise<Election[]> {
    return await Election.find({ relations: ['voters', 'votingSessions'] })
  }

  @Query(() => [ Voter ])
  async allVoters(): Promise<Voter[]> {
    return await Voter.find({ relations: ['elections', 'votingSessions'] });
  }

  @Query(() => [ VotingSession ])
  async allVotingSessions(): Promise<VotingSession[]> {
    return await VotingSession.find({ relations: ['candidates', 'voters', 'election'] });
  }

  // Mutations
  @Mutation(() => Voter)
  async createVoter(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('login') login: string
  ) {
    const voter = new Voter(firstName, lastName, login);
    await voter.save();

    return voter;
  }

  @Mutation(() => Election)
  async createElection(
    @Arg('voterIds', () => [ID]) voterIds: number[]
  ) {
    const voters = await Voter.findByIds(voterIds);
    const election = new Election(voters);
    await election.save();

    return election;
  }

  @Mutation(() => Election)
  async registerVoters(
    @Arg('voterIds', () => [ID]) voterIds: number[],
    @Arg('electionId', () => ID) electionId: number
  ) {
    const voters = await Voter.findByIds(voterIds);
    const election = await Election.findOne(electionId);

    election?.registerVoters(voters);
    await election?.save();

    return election;
  }

  @Mutation(() => Election)
  async registerVoter(
    @Arg('voterId', () => ID) voterId: number,
    @Arg('electionId', () => ID) electionId: number
  ) {
    const voter = await Voter.findOne(voterId);
    const election = await Election.findOne(electionId);

    if (voter) {
      election?.registerVoters([voter]);
      await election?.save();
    }

    return election;
  }

  @Mutation(() => Vote)
  async vote(
    @Arg('voterId', () => ID) voterId: number,
    @Arg('candidateId', () => ID) candidateId: number,
    @Arg('votingSessionId', () => ID) votingSessionId: number,
  ) {
    const voter = await Voter.findOne(voterId);
    const candidate = await Voter.findOne(candidateId);
    const votingSession = await VotingSession.findOne(votingSessionId);

    if (voter && candidate) {
      votingSession?.vote(voter, candidate);
      await votingSession?.save();
    }

    return votingSession;
  }

  @Mutation(() => Election)
  async startElection(
    @Arg('electionId', () => ID) electionId: number
  ) {
    const election = await Election.findOne(electionId, { relations: ['votingSessions'] });

    return election;
  }
}