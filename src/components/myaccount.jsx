import { BigNumber, ethers } from 'ethers'
import React from 'react'
import {useSigner, useAccount} from 'wagmi';
import  {useState , useEffect} from 'react'

const Myaccount = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner();

  const [currentIndex, setcurrentIndex] = useState(undefined);
  const [betinfo, setbetinfo] = useState({username : undefined, betvalue : undefined});
  const [create_txhash, setcreate_txhash] = useState(undefined);
  
  useEffect(() => {
    getindex()
  }, []);
  
  useEffect(() => {
    console.log('create_txhash: ', create_txhash);
    console.log('betinfo: ', betinfo);
  }, [create_txhash, betinfo]);

  const chessMarket_address = "0x6b70Aab27cEBDb1C5206a02094d11fE4c347c40D";
  const MARKET_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"accepter","type":"address"},{"indexed":true,"internalType":"address","name":"creater","type":"address"},{"indexed":true,"internalType":"bytes","name":"accepter_username","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"creater_username","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"matchIndex","type":"uint256"}],"name":"Accepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"creater","type":"address"},{"indexed":true,"internalType":"bytes","name":"creater_username","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"matchescreated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"betvalue","type":"uint256"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"_creater","type":"address"},{"internalType":"uint256","name":"_indexAt","type":"uint256"},{"internalType":"bytes","name":"_creater_username","type":"bytes"},{"internalType":"bytes","name":"_accepter_username","type":"bytes"}],"name":"acceptInvite","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_creater","type":"address"},{"internalType":"uint256","name":"_indexAt","type":"uint256"}],"name":"cancel_AcceptedMatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_indexAt","type":"uint256"}],"name":"cancel_CreatedMatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"my_username","type":"bytes"}],"name":"createMatch","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"matches_ofuser","outputs":[{"internalType":"address","name":"against","type":"address"},{"internalType":"uint256","name":"betvalue","type":"uint256"},{"internalType":"enum ChessMarket.Game","name":"gamestatus","type":"uint8"},{"internalType":"bytes","name":"creater_username","type":"bytes"},{"internalType":"bytes","name":"accepter_username","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_creater","type":"address"},{"internalType":"uint256","name":"_indexAt","type":"uint256"}],"name":"withdrawComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_apiurl","type":"string"}],"name":"withdrawInitiate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
  const ChessMarket = new ethers.Contract(chessMarket_address, MARKET_ABI, signer);

  
  const getindex = async () => {
  
    try {
      const options = {method: 'GET'};
      fetch(`https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=28997970&toBlock=latest&address=0x6b70Aab27cEBDb1C5206a02094d11fE4c347c40D&topic0=0x18a6777340b2db1ada9763300dc0b7eb92a9624bfd688586807af4f475d341f0&topic0_1_opr=and&topic1=0x000000000000000000000000${address.slice(2)}&apikey=${process.env.REACT_APP_ETHERSCAN_APIKEY}`, options)
      .then(response => response.json())
      .then(response => {
        
        console.log('created' ,response)
        response.status != 0 ? setcurrentIndex(response.result.length) : setcurrentIndex(0)
        
      })
      .catch(err => console.error(err));
    } catch (error) {
      console.log(error)
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
	
	    const _usernameinbytes = _bytesToHex(betinfo.username)
	    const txn = await ChessMarket.createMatch(_usernameinbytes, {value : betinfo.betvalue });
	    console.log('txn: ', txn);
	
	    setcreate_txhash(txn.hash);
	    const receipt = await txn.wait() 
	    console.log('receipt: ', receipt);
    } catch (error) {
	    console.log(error)
    }
    
  }
  

  return (
    <div className="myacount_component">

        <div className="creatematch_container">
          <div className="createMatch_card">
              
              <form action="">
                <input type="text" placeholder = "your chess.com username" onChange={(e) => setbetinfo(prev => {return{...prev, username : e.target.value}})} />
                <input type="text" placeholder = 'bet value in matic' onChange={(e) => setbetinfo(prev => {return{...prev, betvalue : JSON.stringify(e.target.value * 1e18) }})} />
                <button onClick={createMatch}>Create NewMatch</button>
                {create_txhash && <a href={`https://mumbai.polygonscan.com/tx/${create_txhash}`}><button>View transaction</button></a>}
              </form>
              
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

