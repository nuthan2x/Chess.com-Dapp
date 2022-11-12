import React from 'react'
import {useSigner, useAccount} from 'wagmi';
import  {useState , useEffect} from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import {  FaGithubSquare, FaTwitterSquare } from 'react-icons/fa';

const Home = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner();

  const [username, setusername] = useState(undefined);
  const [getusername, setgetusername] = useState(undefined);
  const [registertxn, setregistertxn] = useState(undefined);

  const chessMarket_address = "0x6eE88cA69d259236296CbEF50e238Cdc9960Dd3f";
  const MARKET_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"accepter","type":"address"},{"indexed":true,"internalType":"address","name":"creater","type":"address"},{"indexed":true,"internalType":"bytes","name":"accepter_username","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"creater_username","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"matchIndex","type":"uint256"}],"name":"Accepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"creater","type":"address"},{"indexed":false,"internalType":"bytes","name":"creater_username","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"matchescreated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"betvalue","type":"uint256"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"registerer","type":"address"},{"indexed":false,"internalType":"bytes","name":"_username","type":"bytes"}],"name":"Registered","type":"event"},{"inputs":[{"internalType":"address","name":"_creater","type":"address"},{"internalType":"uint256","name":"_indexAt","type":"uint256"},{"internalType":"bytes","name":"_accepter_username","type":"bytes"}],"name":"acceptInvite","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_indexAt","type":"uint256"}],"name":"cancel_CreatedMatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"createMatch","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"matches_ofuser","outputs":[{"internalType":"address","name":"against","type":"address"},{"internalType":"uint256","name":"betvalue","type":"uint256"},{"internalType":"enum ChessMarket.Game","name":"gamestatus","type":"uint8"},{"internalType":"bytes","name":"creater_username","type":"bytes"},{"internalType":"bytes","name":"accepter_username","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"_username","type":"bytes"}],"name":"registerUsername","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"username","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_creater","type":"address"},{"internalType":"uint256","name":"_indexAt","type":"uint256"}],"name":"withdrawComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_apiurl","type":"string"}],"name":"withdrawInitiate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
  const ChessMarket = new ethers.Contract(chessMarket_address, MARKET_ABI, signer);



  useEffect(() => {
    _getusername()
  }, [address, isConnecting,isDisconnected]);

  useEffect(() => {
    setusername('')
    setregistertxn('')
  }, [isDisconnected]);

  const _getusername =async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://deep-index.moralis.io/api/v2/0x6eE88cA69d259236296CbEF50e238Cdc9960Dd3f/logs',
        params: {
          chain: 'mumbai',
          from_block: '29072455',
          topic0: '0xb5ca2dfb0bd25603299b76fefa9fbe3abdc9f951bdfb7ffd208f93ab7f8e203c',
          topic1: `0x000000000000000000000000${address?.slice(2)}`,
          limit: '1000'
        },
        headers: {accept: 'application/json', 'X-API-Key': process.env.REACT_APP_MORALIS_API}
      };
      
      axios
        .request(options)
        .then(function (response) {
          setgetusername(ethers.utils.parseBytes32String( `0x${response.data.result[0].data.slice(130)}`));
          console.log(`${ethers.utils.parseBytes32String( `0x${response.data.result[0].data.slice(130)}`)}`);
        })
        .catch(function (error) {
          console.error(error);
        });
      } catch(error) {
        console.log('error: ', error);
        
    }
  }

  const register = async () => {
    try {
      console.log('username: ', username);
      const txn = await ChessMarket.registerUsername(`0x${username}`);
      setregistertxn(`https://mumbai.polygonscan.com/tx/${txn.hash}`)
      let receipt = await txn.wait()
      console.log('receipt: ', receipt);
      _getusername()
    } catch(error) {
      console.log('error: ', error);
      
    }
  }

  function _bytesToHex(string) {
    return Array.from(
      new TextEncoder().encode(string),
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
  }

  return (
    <div className="home">
      <div className="infocard">
        <h2>Create bets and play @Chess.com</h2>
        <p>built using chainlink oracles</p>
      </div>
      <div className='bodycards'>
        <div className="howitworks">
          <h3>how it works</h3>
          <div className='instructions'>
            <p>1. Register your chess.com username in this Home page</p>
            <p>2. Then create bets in myaccount page, so it can be listed on Market page for accepting invite by other player</p>
            <p>3. If your bet is accepted go to chess.com and invite that player.</p>
            <p>4. Disclaimer : Now the both bets stakes are locked , so any one of the player has to invite in chess.com</p>
            <p>5. After playing the pame, the winner can withdraw rewards in myaccount page by submittimg the url of their live match</p>
            <p>6. 10% platform fee so, max reward is fixed at 1.8x of bet staked.</p>
          </div >
        </div>
        <div className="userregistration">
            {(getusername && !isDisconnected) && <p>my username : <span className='accountaddress'>{`${getusername}`}</span></p>}
            {address && <p >linking to  <span className='accountaddress'>{`${address?.slice(0,5)}...${address?.slice(38)}`}</span></p>}
            <h3>New username</h3>
            <form action="">
              {/* <label htmlFor="">Username : </label> */}
              <input type="text" placeholder='chess.com username'  onChange={(e) => setusername(_bytesToHex(e.target.value))}/>
            </form>
            <button onClick={register} className='registerbutton'>register</button>
            {registertxn && <a href={registertxn} target="_blank" rel="noopener noreferrer"><button className='registerbutton'>View on &nbsp;<img src="https://etherscan.io/images/brandassets/etherscan-logo-light-circle.png" alt="" /></button> </a>}

        </div>
      </div >

      <div className="footer">
       <h2> 
          Built by &nbsp;
          <a href="https://twitter.com/nuthan_2x" target="_blank" rel="noopener noreferrer">nuthan_2x  &nbsp;</a> 
          <a href="https://twitter.com/nuthan_2x" className='icon' target="_blank" rel="noopener noreferrer"><FaTwitterSquare /> &nbsp;</a>
          <a href="https://github.com/nuthan2x/Chess.com-Dapp" className='icon' target="_blank" rel="noopener noreferrer"><FaGithubSquare /> &nbsp;</a>
       </h2>
      </div>
    </div>
  )
}

export default Home