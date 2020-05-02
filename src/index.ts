import { sum, rollup, shuffle } from "d3-array";

interface Voter {
  rating: number;
  isPresidential: boolean;
}

// const voteDistribution = [
//   [0, 1, 1, 1, 1, 1, 1, 1, 1],
//   [0, 0, 1, 1, 1, 1, 1, 1, 2],
//   [0, 0, 0, 1, 1, 1, 1, 2, 2],
//   [0, 0, 0, 0, 1, 1, 2, 2, 2],
//   [0, 0, 0, 0, 0, 2, 2, 2, 2],
//   [0, 0, 0, 0, 0, 0, 2, 3, 3],
//   [0, 0, 0, 0, 0, 0, 0, 4, 4],
//   [0, 0, 0, 0, 0, 0, 0, 0, 8],
//   [0, 0, 0, 0, 0, 0, 0, 8, 0],
// ];

const voteDistribution = [
  [0, 0, 0, 0, 1, 1, 1, 1, 4],
  [0, 0, 0, 0, 0, 1, 1, 1, 5],
  [0, 0, 0, 0, 0, 0, 1, 2, 5],
  [0, 0, 0, 0, 0, 0, 0, 3, 5],
  [0, 0, 0, 0, 0, 0, 1, 1, 6],
  [0, 0, 0, 0, 0, 0, 0, 2, 6],
  [0, 0, 0, 0, 0, 0, 0, 1, 7],
  [0, 0, 0, 0, 0, 0, 0, 0, 8],
  [0, 0, 0, 0, 0, 0, 0, 8, 0],
];

// const voteDistribution = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 8],
//   [0, 0, 0, 0, 0, 0, 0, 0, 8],
//   [0, 0, 0, 0, 0, 0, 0, 0, 8],
//   [0, 0, 0, 0, 0, 0, 0, 0, 8],
//   [0, 0, 0, 0, 0, 0, 0, 0, 8],
//   [0, 0, 0, 0, 0, 0, 0, 0, 8],
//   [0, 0, 0, 0, 0, 0, 0, 0, 8],
//   [0, 0, 0, 0, 0, 0, 0, 0, 8],
//   [0, 0, 0, 0, 0, 0, 0, 8, 0],
// ];

const votingPopSize = 90000;
const groupSize = 9;
const numPresidentialVoters = 9;
let voters: Voter[] = [];

for (let i = 0; i < votingPopSize; i++) {
  voters.push({
    rating: i % groupSize,
    isPresidential: false,
  });
}

// Mix in voters worthy of becoming president
shuffle(voters.filter((voter) => voter.rating === groupSize - 1))
  .slice(0, numPresidentialVoters)
  .forEach((voter) => (voter.isPresidential = true));

function buildVotingDist(candidates: Voter[], voter: Voter): number[] {
  return voteDistribution[voter.rating].map((dist, index) => {
    if (candidates.find((candidate) => candidate.rating === index)) {
      return dist;
    }

    return 0;
  });
}

function rateVoters(voters: Voter[]): Voter[] {
  let newVoters = [];

  voters.forEach((_voter, index) => {
    if (index % groupSize === 0) {
      let tempVoters = voters
        .slice(index, index + groupSize)
        .sort((a, b) => a.rating - b.rating);

      tempVoters = [
        ...tempVoters.filter((voter) => !voter.isPresidential),
        ...tempVoters.filter((voter) => voter.isPresidential),
      ];

      tempVoters.forEach((voter, index) => {
        voter.rating = index % 9;
      });

      newVoters.push(...tempVoters);
    }
  });


  return newVoters;
}

const votes = [];
function votingSession(candidates: Voter[], voters: Voter[]): Voter {
  const results = voters
    .map((voter, index) => {
      const dist = buildVotingDist(candidates, voter);
      const voterRatings = dist.map((dist) => dist * Math.random());

      const maxRatingIndex = voterRatings.indexOf(Math.max(...voterRatings));
      votes.push(maxRatingIndex);

      return candidates.find((candidate) => candidate.rating == maxRatingIndex);
    })
    .filter((result) => result !== undefined);
  // Filtering out undefined here might be dropping good data. I think undefined might
  // be a result due to the indexOf not handling numbers well. (fingers crossed this is a JS number issue)

  const tally = rollup(
    results,
    (v) => v.length,
    (v) => v.rating
  );

  const mostChosen = Math.max(...tally.values());

  let winners = [];

  tally.forEach((value, key) => {
    if (value === mostChosen) {
      winners.push(candidates.find((candidate) => candidate.rating === key));
    }
  });

  // console.log(tally)
  if (winners.length === 0) {
    throw new Error("Nobody won");
  }

  if (winners.length === 1) {
    return winners[0];
  }

  return votingSession(winners, voters);
}

let sessionWinners: Voter[] = [];

while (voters.length / groupSize > 1) {
  voters = rateVoters(voters);
  // console.log(voters)

  voters.forEach((_voter, index) => {
    if (index % groupSize === 0) {
      sessionWinners.push(
        votingSession(
          voters.slice(index, index + 9),
          voters.slice(index, index + 9)
        )
      );
    }
  });

  voters = sessionWinners.slice();
  sessionWinners = [];
}

console.log(voters)