import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, Index } from 'typeorm';
import { Voter } from './Voter';
import { VotingSession } from './VotingSession';

@Entity()
@ObjectType()
export class Election extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Field(() => [Voter])
  @ManyToMany(
    () => Voter,
    voter => voter.elections
  )
  @JoinTable()
  voters: Voter[];

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
}
