import React, { useEffect, useState } from "react";
import './App.css';
import contract from './contracts/NFTCollectible.json';
import { ethers } from 'ethers';

const contractAddress = "0x2CaA6CC25f010AD16689F33E5793e256BA60CA6D";
const abi = contract.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have MetaMask installed!");
      return;
    } else {
      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);
      const mumbaiChainId = "0x13881";
      if (chainId !== mumbaiChainId) {
        alert("You are not connected to the Mumbai Test Network!");
      }
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install MetaMask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") });

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: ${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }



  useEffect(() => {
    checkWalletIsConnected();
  }, [])

  return (
    <div className='main-app'>
      <h1 class="heading gradient-text">
        <div class="banner-img">
          <a href="https://testnets.opensea.io/collection/rinkeby-squirrels" target="_blank" rel="noreferrer">Polygon NFT Squirrels</a>
        </div>
      </h1>
      <div>
      <button class="os-button">
        <a href="https://testnets.opensea.io/collection/rinkeby-squirrels" target="_blank" rel="noreferrer">View Collection on Opensea</a>
      </button>
      </div>
      <div>
        <div class="banner-img">
          <img src="https://nft-collectible-demoo.vercel.app/static/media/rinkeby_squirrels.9fa7865532739418b97d.gif" alt="Polygon Squirrels"></img>
        </div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
      <footer class="footer">
        <p>
          OUR SMART CONTRACT ADDRESS: <br></br>
          <span>
            <a class="contract-link" href={`https://mumbai.polygonscan.com/address/${contractAddress}`} target="_blank" rel="noreferrer">{contractAddress}</a> 
          </span>
        </p>
      </footer>
    </div>
  )
}

export default App;
