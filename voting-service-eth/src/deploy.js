const Web3 = require('web3');
const web3 = new Web3("http://localhost:8545");

const bytecode = fs.readFileSync('Voting_sol_Voting.bin').toString();
const abi = JSON.parse(fs.readFileSync('Voting_sol_Voting.abi').toString());

const deployedContract = new web3.eth.Contract(abi);
const listOfCandidates = ['Rama', 'Nick', 'Jose'];

deployedContract.deploy({
  data: bytecode,
  arguments: [listOfCandidates.map(name => web3.utils.asciiToHex(name))]
}).send({
  from: 'ENTER 1 OF 10 ACCOUNT ADDRESSES like 0xfb3....',
  gas: 1500000,
  gasPrice: web3.utils.toWei('0.00003', 'ether')
}).then((newContractInstance) => {
  deployedContract.options.address = newContractInstance.options.address
  console.log(newContractInstance.options.address)
});