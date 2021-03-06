import { Voter, votingSession, votingRound } from '../voting';

describe('voting', () => {
  describe('votingSession', () => {
    it('can return one winner', () => {
      const voters: Voter[] = [
        { iq: 100, votingAbilityIndex: 0.9 },
        { iq: 140, votingAbilityIndex: 0.99 },
        { iq: 130, votingAbilityIndex: 0.8 },
        { iq: 80, votingAbilityIndex: 0.85 },
      ];

      expect(votingSession(voters, voters)).toBe(voters[1]);
    });

    describe('when there is a tie', () => {
      describe('when there are fewer winners than candidates', () => {
        it('runs another voting session until there is a winner', () => {
          const voters: Voter[] = [
            { iq: 100, votingAbilityIndex: 0.7 },   // votes for iq 135
            { iq: 140, votingAbilityIndex: 0.99 },  // votes for iq 135
            { iq: 130, votingAbilityIndex: 0.8 },   // votes for iq 140
            { iq: 135, votingAbilityIndex: 0.95 },  // votes for iq 140
          ];
    
          expect(votingSession(voters, voters)).toBe(voters[1]);
        });
      });

      describe('when the votes are evenly distributed among the candidates', () => {
        it('randomly selects a candidate to be the winner', () => {
          const candidates: Voter[] = [
            { iq: 140, votingAbilityIndex: 0.99 },  // votes for iq 135
            { iq: 135, votingAbilityIndex: 0.95 },  // votes for iq 140
          ];

          const voters: Voter[] = [
            { iq: 100, votingAbilityIndex: 0.4 },   // votes for iq 135
            { iq: 140, votingAbilityIndex: 0.4 },  // votes for iq 135
            { iq: 130, votingAbilityIndex: 0.8 },   // votes for iq 140
            { iq: 135, votingAbilityIndex: 0.95 },  // votes for iq 140
          ];

          const candidateIqs = [ 135, 140 ];
          const winner = votingSession(candidates, voters)

          expect(candidateIqs.includes(winner.iq)).toBe(true);
        });
      });
    });
  });

  describe('votingRound', () => {
    it('runs voting sessions with groups of the given group size', () => {
      const voters: Voter[] = [
        // Voting Group 1
        { iq: 100, votingAbilityIndex: 0.7 },   // votes for iq 140
        { iq: 140, votingAbilityIndex: 0.99 },  // votes for iq 130
        { iq: 130, votingAbilityIndex: 0.8 },   // votes for iq 140

        // Voting Group 2
        { iq: 133, votingAbilityIndex: 0.95 },  // votes for iq 135
        { iq: 130, votingAbilityIndex: 0.8 },   // votes for iq 135
        { iq: 135, votingAbilityIndex: 0.95 },  // votes for iq 133
      ];

      const winners: Voter[] = [
        voters[1],
        voters[5]
      ];

      expect(votingRound(voters, 3)).toEqual(winners);
    });
  })
})