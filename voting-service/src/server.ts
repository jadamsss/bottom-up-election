import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';

import { initDb } from './database/init';
import { Resolvers } from './schema/Resolvers';

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
