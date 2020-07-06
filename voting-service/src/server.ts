import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { Election, Vote, Voter, VotingSession } from './models';
import { Resolvers } from './schema/Resolvers';
import faker from 'faker';


const options: ConnectionOptions = {
  type: 'sqlite',
  database: './database.sqlite3',
  entities: [ Election, Vote, Voter, VotingSession ],
}

async function seedDb() {
  const voters = [];
  for (let i = 0; i < 100; i++) {
    const voter = new Voter(
      faker.name.firstName(),
      faker.name.lastName(),
      faker.internet.email()
    );

    await voter.save();
    voters.push(voter);
  }

  const election = new Election(voters);
  await election.save();
}

export async function initDb() {
  const connection = await createConnection(options);
  await connection.dropDatabase();
  await connection.synchronize();
  await seedDb();
}

async function main() {
  await initDb();
  console.log('Database created');

  const schema = await buildSchema({
    resolvers: [ Resolvers ],
  });

  const apolloServer = new ApolloServer({ schema });
  const app = express();
  apolloServer.applyMiddleware({ app });

  app.listen(
    4000,
    () => console.log(`Server started on http://localhost:4000${apolloServer.graphqlPath}`)
  );
}

main();
