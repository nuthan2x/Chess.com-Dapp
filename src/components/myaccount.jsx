import { BigNumber, ethers } from 'ethers'
import React from 'react'
import {useSigner, useAccount} from 'wagmi';
import  {useState , useEffect} from 'react'
import axios from 'axios';

const Myaccount = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner();

  const [getusername, setgetusername] = useState(undefined);
  const [betstake, setbetstake] = useState(undefined);
  const [create_txnhash, setcreate_txnhash] = useState(undefined);
  
  useEffect(() => {
    console.log('betstake: ', betstake);
   
  }, [betstake]);
  
  const chessMarket_address = "0x6eE88cA69d259236296CbEF50e238Cdc9960Dd3f";
  const MARKET_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"accepter","type":"address"},{"indexed":true,"internalType":"address","name":"creater","type":"address"},{"indexed":true,"internalType":"bytes","name":"accepter_username","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"creater_username","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"matchIndex","type":"uint256"}],"name":"Accepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"creater","type":"address"},{"indexed":false,"internalType":"bytes","name":"creater_username","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"matchescreated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"betvalue","type":"uint256"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"registerer","type":"address"},{"indexed":false,"internalType":"bytes","name":"_username","type":"bytes"}],"name":"Registered","type":"event"},{"inputs":[{"internalType":"address","name":"_creater","type":"address"},{"internalType":"uint256","name":"_indexAt","type":"uint256"},{"internalType":"bytes","name":"_accepter_username","type":"bytes"}],"name":"acceptInvite","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_indexAt","type":"uint256"}],"name":"cancel_CreatedMatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"createMatch","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"matches_ofuser","outputs":[{"internalType":"address","name":"against","type":"address"},{"internalType":"uint256","name":"betvalue","type":"uint256"},{"internalType":"enum ChessMarket.Game","name":"gamestatus","type":"uint8"},{"internalType":"bytes","name":"creater_username","type":"bytes"},{"internalType":"bytes","name":"accepter_username","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"_username","type":"bytes"}],"name":"registerUsername","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"username","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_creater","type":"address"},{"internalType":"uint256","name":"_indexAt","type":"uint256"}],"name":"withdrawComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_apiurl","type":"string"}],"name":"withdrawInitiate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
  const ChessMarket = new ethers.Contract(chessMarket_address, MARKET_ABI, signer);
  
  useEffect(() => {
    
    
    // getindex()
    _getusername()

  }, [address]);

  const getindex = async () => {
  
    try {
      const options = {
        method: 'GET',
        url: 'https://deep-index.moralis.io/api/v2/0x6eE88cA69d259236296CbEF50e238Cdc9960Dd3f/logs',
        params: {
          chain: 'mumbai',
          from_block: '28997970',
          topic0: '0x18a6777340b2db1ada9763300dc0b7eb92a9624bfd688586807af4f475d341f0',
          topic1: `0x000000000000000000000000${address.slice(2)}`
        },
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.REACT_APP_MORALIS_API
        }
      };
      
      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    } catch (error) {
      console.log(error)
    }
  }

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


  function _bytesToHex(string) {
    return Array.from(
      new TextEncoder().encode(string),
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
  }

  const createMatch = async (e) => {
    e.preventDefault()
    try {
      const options = {value: ethers.utils.parseUnits(betstake)}
      const txn = await ChessMarket.createMatch(options)
      setcreate_txnhash(`https://mumbai.polygonscan.com/tx/${txn.hash}`)
      console.log('hash ', `https://mumbai.polygonscan.com/tx/${txn.hash}`);
      const receipt = await txn.wait()
      setbetstake('')

    } catch (error) {
      console.log('error: ', error);
      
    }
    
  }
  

  return (
    <div className="myacount_component">
        <div className="creatematchcontainer">
          <h2>Create a New Match</h2>
          <div className="creatematchcard">
            <h3>{`username : ${getusername}`}</h3>
            <form action="">
              <input type="text" placeholder='bet to stake (in MATIC)' onChange={e => setbetstake(e.target.value)} value={betstake}/>
            </form>
            <button onClick={createMatch} className='registerbutton'>New Match</button>
            {create_txnhash && <a href={create_txnhash} target="_blank" rel="noopener noreferrer"><button className='registerbutton'>View on &nbsp;<img src="https://etherscan.io/images/brandassets/etherscan-logo-light-circle.png" alt="" /></button> </a>}
          </div>
        </div>
    </div>
  )
}

export default Myaccount





  // var web3 = new Web3.providers.HttpProvider(process.env.REACT_APP_ALCHEMY_MUMBAI)
  // const contract = new Contract(MARKET_ABI, chessMarket_address)

  // contract.getPastEvents('Created', {
  //   topics : ["0x18a6777340b2db1ada9763300dc0b7eb92a9624bfd688586807af4f475d341f0",`0x000000000000000000000000${address.slice(2)}`],
  //   fromBlock: 28997952,
  //   toBlock: 'latest'
  // }, function(error, events){ console.log(events); })
  // .then(function(events){
  //   console.log(events) // same results as the optional callback above
  // });


//  function bytesToHex(bytes) {
//     return Array.from(
//       bytes,
//       byte => byte.toString(16).padStart(2, "0")
//     ).join("");
//   }
  
  
//   function stringToUTF8Bytes(string) {
//     return new TextEncoder().encode(string);
//   }

// function bytesToHex(string) { // utf8 only 
//   return Array.from(
//     new TextEncoder().encode(string),
//     byte => byte.toString(16).padStart(2, "0")
//   ).join("");
// }


// `0x${bytesToHex(stringToUTF8Bytes("d_caslav"))}`


// eslint-disable-next-line no-lone-blocks
{/* <div className="creatematch_container">
          <div className="createMatch_card">
              
              <form action="">
                <input type="text" placeholder = "your chess.com username" onChange={(e) => setbetinfo(prev => {return{...prev, username : e.target.value}})} />
                <input type="text" placeholder = 'bet value in matic' onChange={(e) => setbetinfo(prev => {return{...prev, betvalue : JSON.stringify(e.target.value * 1e18) }})} />
                <button onClick={createMatch}>Create NewMatch</button>
                {create_txhash && <a href={`https://mumbai.polygonscan.com/tx/${create_txhash}`} target="_blank" rel="noopener noreferrer"><button>View transaction</button></a>}
              </form>
              
          </div>
</div> */}
