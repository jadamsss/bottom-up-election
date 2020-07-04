import { Query, Resolver, Arg, Mutation, createUnionType } from 'type-graphql';
import { Election, Voter, VotingSession } from '../models';

@Resolver()
export class Resolvers {
  @Query(() => [ Election ])
  async allElections(): Promise<Election[]> {
    return await Election.find();
  }

  @Query(() => [ Voter ])
  async allVoters(): Promise<Voter[]> {
    return await Voter.find();
  }

  @Query(() => [ VotingSession ])
  async allVotingSessions(): Promise<VotingSession[]> {
    return await VotingSession.find();
  }

  // @Mutation(() => Election)
  // async createElection(@Arg('voters') voters: Voter[]): Promise<Election> {
  //   const election = Election.create({ voters })
  //   await election.save();

  //   return election;
  // }

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
}