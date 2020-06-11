# Election Acceptance Criteria
## Voter
A Voter has the following public attributes:
- ID
- First Name
- Last Name
- Location
  - City
  - County
  - State
- Party?
  - Do we want this? To integrate this voting style into the existing voting system this may be necessary. But further research is necessary to determine if positives of political parties outweigh the negatives
- Background
  - Summary
  - Resume / CV
- Social Media Account Links
- Profile Picture
- Network
  - A list of other voters
  - Two voters must both agree to join into a network (like a friend or follower request, one person initiates the request, the other must accept)

A Voter has the following private attributes:
- Notes (free form text documents)
- Voting history (do we want this?)

## Candidate (extends Voter)
A Candidate has a:
- Summary
- Positions
- Video
- Constituency (list of voters below the candidate). Might not want this.

## Voting Session
### Candidate List
- Candidates are shuffled before being listed
- List item contains:
  - First and last name
  - Background summary
  - Profile Picture

### Candidate Profile Page
All candidate attributes

## Determination of a Voting Group
Depending on the scale of the election (i.e. city, state, federal), the voting group is built up of Voters with the most mutual connections via there voter network. If it is a city election, the voter group will be made up of the most interconnected (via the voter network) voters in that city. State elections will limit to connections inside the state. Federal elections will not limit based on voter location.


## Anonymous Voting
Two separate systems must be implemented:
- A voter registration and verification system. This will keep track of if a voter has voted yet or not for a given voting session.
- A vote collection system. This will contain only the votes themselves (the id candidate that received the vote and the voting session id).

These two systems should be built on Ethereum.
