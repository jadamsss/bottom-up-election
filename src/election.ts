export interface Voter {
  iq: number;
  votingAbilityIndex: number; // decimal between 0 and 1, higher is better
}

export function votingSession(candidates: Voter[], voters: Voter[]): Voter {
  const sortedCandidates = candidates.slice();
  sortedCandidates.sort((a, b) => a.iq > b.iq ? 1 : -1);

  const votes = voters.map((voter) => {
    const vote = Math.floor(voter.votingAbilityIndex * sortedCandidates.length);
    
    if (voter === sortedCandidates[vote]) {
      if (vote === sortedCandidates.length - 1) {
        return vote - 1;
      }

      return vote + 1;
    }

    return  vote;
  });

  const tally = votes.reduce((prev, curr) => {
    if (prev.has(curr)) {
      prev.set(curr, prev.get(curr) + 1);
    } else {
      prev.set(curr, 1);
    }

    return prev;
  }, new Map<number, number>());

  // Indexes of the candidates with the most votes
  let winners: number[] = [];
  let mostVotes = 0;

  tally.forEach((value, key) => {
    if (value > mostVotes) {
      winners = [ key ];
      mostVotes = value;
    } else if (value === mostVotes) {
      winners.push(key);
    }
  });

  switch(winners.length) {
    case 0:
      throw new Error('No winners');
    case 1:
      return sortedCandidates[winners[0]];
    default:
      return votingSession(sortedCandidates.filter((_candidate, index) => winners.includes(index)), voters);
  }
}

export function votingRound(voters: Voter[], groupSize: number): Voter[] {
  return voters.map((_voter, index) => {
    if (index % groupSize === 0) {
      let votingGroup = voters.slice(index, index + groupSize);
      return votingSession(votingGroup, votingGroup);
    }
  }).filter((winner) => winner !== undefined);
}
