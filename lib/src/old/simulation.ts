import { randomNormal, randomExponential } from 'd3-random';
import { votingRound, Voter } from './election';


function generateVoterAbilityIndex(iq: number, normalizer = 10) {
  return 1 - randomExponential(iq / normalizer)();
}

function buildVoters(numVoters: number, meanIq: number, iqStdDev: number): Voter[] {
  const generator = randomNormal(meanIq, iqStdDev);

  let voters: Voter[] = [];
  let iq: number;

  for (let i = 0; i < numVoters; i++) {
    iq = Math.round(generator());

    voters.push({
      iq: Math.round(generator()),
      votingAbilityIndex: generateVoterAbilityIndex(iq),
    })
  }

  return voters;
}

function simulation() {
  let voters = buildVoters(1000000, 100, 15);
  const groupSize = 10;

  while (voters.length > groupSize) {
    voters = votingRound(voters, groupSize);
  }

  return voters;
}

for (let i = 0; i < 10; i++) {
  console.log(simulation());
}
