import { randomNormal, randomExponential } from 'd3-random';
import { Voter } from './voting';

/**
 * 
 * @param iq The IQ of the voter
 * @param normalizer The inverse scaling factor for the IQ
 * 
 * @returns A number between 0 and 1
 */
function generateVoterAbilityIndex(iq: number, normalizer = 10) {
  return Math.min(1, Math.max(1 - randomExponential(iq / normalizer)(), 0));
}

/**
 * 
 * @param numVoters Number of voters to create
 * @param meanIq The mean IQ the voters
 * @param iqStdDev The standard deviation of IQ for the voters
 * 
 * @return The voters
 */
export function buildVoters(numVoters: number, meanIq: number, iqStdDev: number): Voter[] {
  const generator = randomNormal(meanIq, iqStdDev);

  let voters: Voter[] = [];
  let iq: number;

  for (let i = 0; i < numVoters; i++) {
    iq = Math.round(generator());

    voters.push({
      iq,
      votingAbilityIndex: generateVoterAbilityIndex(iq),
    })
  }

  return voters;
}
