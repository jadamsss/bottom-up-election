import { ID, Query, Resolver, Arg, Mutation } from 'type-graphql';
import { Election, Voter, VotingSession } from '../models';

@Resolver()
export class Resolvers {
  // Queries
  @Query(() => [ Election ])
  async allElections(): Promise<Election[]> {
    return await Election.find({ relations: ['voters', 'votingSessions'] })
  }

  @Query(() => [ Voter ])
  async allVoters(): Promise<Voter[]> {
    return await Voter.find();
  }

  @Query(() => [ VotingSession ])
  async allVotingSessions(): Promise<VotingSession[]> {
    return await VotingSession.find();
  }

  // Mutations
  @Mutation(() => Voter)
  async createVoter(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('login') login: string
  ) {
    const voter = Voter.create({ firstName, lastName, login })
    await voter.save();

    return voter;
  }

  @Mutation(() => Election)
  async createElection(
    @Arg('voterIds', () => [ID]) voterIds: number[]
  ) {
    const voters = await Voter.findByIds(voterIds);
    console.log(voters);
    const election = Election.create({ voters })
    await election.save();

    return election;
  }
}