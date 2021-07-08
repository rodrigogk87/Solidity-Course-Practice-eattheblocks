const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const Migrations = artifacts.require("Wallet");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(Wallet, [accounts[1],accounts[2],accounts[3]], 2);
  const wallet = await Wallet.deployed();
  await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 10000})
};
