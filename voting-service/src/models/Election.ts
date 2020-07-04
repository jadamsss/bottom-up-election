import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Voter } from './Voter';
import { VotingSession } from './VotingSession';

@Entity()
@ObjectType()
export class Election extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @ManyToMany(
    type => Voter,
    voter => voter.elections
  )
  @JoinTable()
  voters: Voter[];

  @OneToMany(
    type => VotingSession,
    VotingSession => VotingSession.election
  )
  @JoinTable()
  votingSessions!: VotingSession[];

  constructor(voters: Voter[]) {
    super();

    this.voters = voters;
  }
}
