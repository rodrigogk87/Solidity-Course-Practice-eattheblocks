import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { getWeb3, getWallet } from './utils.js';
import Header from './Header';
import NewTransfer from './NewTransfer.js';
import TransferList from './TransferList.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState([]);
  const [balance, setBalance] = useState(undefined);

  useEffect(()=>{
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call();
      const quorum = await wallet.methods.quorum().call();
      const transfers = await wallet.methods.getTransfers().call();
      const balance = await web3.eth.getBalance(wallet.options.address);

      setWeb3(web3);
      setAccounts(accounts);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
      setTransfers(transfers);
      setBalance(balance);

    };
    init();
  },[]);


  const reFetchTransfers = async () => {
    const transfers = await wallet.methods.getTransfers().call();
    setTransfers(transfers);
  }

  const createTransfer = async transfer => {
      await wallet.methods
        .createTransfer(transfer.amount, transfer.to)
        .send({from: accounts[0], gas: 1000000});
        await reFetchTransfers();
  }

  const approveTransfer = async transferId => {
    await wallet.methods
      .approveTransfer(transferId)
      .send({from: accounts[0], gas: 1000000});
      await reFetchTransfers();
  }

  if(typeof web3 === 'undefined' || typeof accounts === 'undefined'  
      || typeof wallet === 'undefined' || typeof approvers.length===0 || typeof quorum === 'undefined' ){
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
       Multisig Wallet - Balance: { balance }
       <Header approvers={approvers} quorum={quorum} />
       <NewTransfer createTransfer={createTransfer} />
       <TransferList transfers={transfers}  approveTransfer={approveTransfer}/>
    </div>
  );
}

export default App;
