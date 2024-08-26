import React, { useState } from 'react';
import Web3 from 'web3';
import './App.css';
import Coin from './Coin';
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "side",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "win",
				"type": "bool"
			}
		],
		"name": "CoinFlipped",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "bool",
				"name": "_side",
				"type": "bool"
			}
		],
		"name": "flipCoin",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = '0xB846FB9dD5eD616E6c073f10bE7515D5bE9ff0D4';

function App() {
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState('0');
  const [result, setResult] = useState('');
  const [flipping, setFlipping] = useState(false);

  const handleFlip = async () => {
    if (amount <= 0) {
      setResult('Please enter a valid amount to bet.');
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      setFlipping(true);

      try {
        const response = await contract.methods.flipCoin(side).send({
          from: accounts[0],
          value: web3.utils.toWei(amount, 'ether'),
        });

        const eventResult = response.events.CoinFlipped.returnValues.result;

        if (eventResult) {
          setResult(`Congratulations! You won ${amount * 2} tokens!`);
        } else {
          setResult('Sorry, you lost. Better luck next time!');
        }
      } catch (error) {
        console.error(error);
        setResult('Transaction failed!');
      }

      setFlipping(false);
    } else {
      setResult('Please install MetaMask to use this feature.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Coin Flip Game</h1>
        <div className="form-group">
          <label htmlFor="amount">Amount to Bet (in Ether):</label>
          <input 
            type="number" 
            id="amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="side">Choose Side:</label>
          <select id="side" value={side} onChange={(e) => setSide(e.target.value)}>
            <option value="0">Heads</option>
            <option value="1">Tails</option>
          </select>
        </div>
        <button onClick={handleFlip} disabled={flipping}>
          {flipping ? 'Flipping...' : 'Flip Coin'}
        </button>
        {flipping && <Coin side={side} />}
        <p>{result}</p>
      </header>
    </div>
  );
}

export default App;
