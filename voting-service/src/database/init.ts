import { createConnection, ConnectionOptions } from 'typeorm';
import { Election, Vote, Voter, VotingSession } from '../models';

const options: ConnectionOptions = {
  type: 'sqlite',
  database: './database.sqlite3',
  entities: [ Election, Vote, Voter, VotingSession ],
}

export async function initDb() {
  const connection = await createConnection(options);
  await connection.dropDatabase();
  await connection.synchronize();
}
