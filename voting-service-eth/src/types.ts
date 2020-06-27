interface Voter {
  id: string;
  firstName: string;
  lastName: string;
  votingNetwork: string[]; // ids for up to 20 other voters
}

interface Vote {
  sessionId: string;
  voterId: string; // encrypted with voter private key
  candidateId: string;
}

interface VotingSession {
  id: string;
  voters: string[];
  candidates: string[];
}
