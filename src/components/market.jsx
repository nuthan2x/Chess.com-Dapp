import { BigNumber, ethers } from 'ethers'
import React from 'react'
import {useSigner, useAccount} from 'wagmi';
import  {useState , useEffect} from 'react'
import axios from "axios";

const Market = () => {
  const { address, isConnecting, isDisconnected } = useAccount()
  const { data: signer, isError, isLoading } = useSigner();

  const [allMatchdata, setallMatchdata] = useState(undefined);
  const [allAccepteddata, setallAccepteddata] = useState(undefined);
  const [getusername, setgetusername] = useState(undefined);
  const [accept_txnhash, setaccept_txnhash] = useState(undefined);
  const [isAccepted, setisAccepted] = useState(false);

  useEffect(() => {
    _getusername()
    getCreated()
    getAccepted()
  }, [address]);

  const _getusername =async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://deep-index.moralis.io/api/v2/0x7ea1BF0fDE4f5C6EEb0893D0Ed9b9E6b85e5A147/logs',
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
          setgetusername(`${ethers.utils.parseBytes32String( `0x${response.data?.result[0].data.slice(130)}`)}`);
          console.log(`${ethers.utils.parseBytes32String( `0x${response.data?.result[0].data.slice(130)}`)}`);
        })
        .catch(function (error) {
          console.error(error);
        });
      } catch(error) {
        console.log('error: ', error);
        
    }
  }

  const getCreated = async () => {
   
      const options = {
        method: 'GET',
        url: 'https://deep-index.moralis.io/api/v2/0x7ea1BF0fDE4f5C6EEb0893D0Ed9b9E6b85e5A147/logs',
        params: {
          chain: 'mumbai',
          from_block: '28997952',
          topic0: '0x18a6777340b2db1ada9763300dc0b7eb92a9624bfd688586807af4f475d341f0',
          limit: '1000'
        },
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.REACT_APP_MORALIS_API
        }
      };
      // 0x9f3c3bebc94c3cc3b8a4832f980021809f975695c16e2c3760bc560b03b2f2a2
      axios
        .request(options)
        .then(function (response) {
          setallMatchdata(response.data?.result)
          console.log('created eventdata', response.data?.result);
        })
        .catch(function (error) {
          console.error(error);
        });

   
    
  }
  const getAccepted = async () => {
    const options = {
      method: 'GET',
      url: 'https://deep-index.moralis.io/api/v2/0x7ea1BF0fDE4f5C6EEb0893D0Ed9b9E6b85e5A147/logs',
      params: {
        chain: 'mumbai',
        from_block: '29113954%20',
        topic0: '0x9f3c3bebc94c3cc3b8a4832f980021809f975695c16e2c3760bc560b03b2f2a2',
        limit: '1000'
      },
      headers: {accept: 'application/json', 'X-API-Key': process.env.REACT_APP_MORALIS_API}
    };
    
    axios
      .request(options)
      .then(function (response) {
        setallAccepteddata(response.data?.result)
        console.log('accepted eventdata', response.data?.result);
      })
      .catch(function (error) {
        console.error(error);
      });   
  }

  const chessMarket_address = "0x7ea1BF0fDE4f5C6EEb0893D0Ed9b9E6b85e5A147";
  const MARKET_ABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"accepter","type":"address"},{"indexed":true,"internalType":"address","name":"creater","type":"address"},{"indexed":true,"internalType":"bytes","name":"accepter_username","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"creater_username","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"matchIndex","type":"uint256"}],"name":"Accepted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"creater","type":"address"},{"indexed":false,"internalType":"bytes","name":"creater_username","type":"bytes"},{"indexed":false,"internalType":"uint256","name":"matchescreated","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"betvalue","type":"uint256"}],"name":"Created","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"registerer","type":"address"},{"indexed":false,"internalType":"bytes","name":"_username","type":"bytes"}],"name":"Registered","type":"event"},{"inputs":[{"internalType":"address","name":"_creater","type":"address"},{"internalType":"uint256","name":"_indexAt","type":"uint256"},{"internalType":"bytes","name":"_accepter_username","type":"bytes"}],"name":"acceptInvite","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_indexAt","type":"uint256"}],"name":"cancel_CreatedMatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"createMatch","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"matches_ofuser","outputs":[{"internalType":"address","name":"against","type":"address"},{"internalType":"uint256","name":"betvalue","type":"uint256"},{"internalType":"enum ChessMarket.Game","name":"gamestatus","type":"uint8"},{"internalType":"bytes","name":"creater_username","type":"bytes"},{"internalType":"bytes","name":"accepter_username","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"_username","type":"bytes"}],"name":"registerUsername","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"username","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_creater","type":"address"},{"internalType":"uint256","name":"_indexAt","type":"uint256"}],"name":"withdrawComplete","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_target","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdrawETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_apiurl","type":"string"}],"name":"withdrawInitiate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
  const ChessMarket = new ethers.Contract(chessMarket_address, MARKET_ABI, signer);

  
  const getUTCtime = (t) => {
    let date = new Date(t).toUTCString()
    let  AMorPM = date?.slice(17,19) < 12 ? 'AM' : "PM"
    return `${date?.slice(4,22)} ${AMorPM}`
  }

  const acceptInvite = async (data, topic1) => {
    let index = parseInt(data?.slice(66,130)).toString()
    console.log('index: ', index);
    let betvalue = parseInt(`0x${data?.slice(130,194)}`).toString()
    console.log('betvalue: ', betvalue);
    let creater_address = `0x${topic1?.slice(26)}`
    console.log('creater_address: ', creater_address);
    let accepter_username = `0x${_bytesToHex(getusername)}`
    console.log('accepter_username: ', accepter_username);

    const options = {value: ethers.utils.parseUnits(betvalue, 'wei')}    

    const txn = await ChessMarket.acceptInvite(creater_address, index, accepter_username, options)
    console.log('txn: ', `https://mumbai.polygonscan.com/tx/${txn.hash}`);
    const receipt = await txn.wait()
    setisAccepted(true)


  }

  function _bytesToHex(string) {
    return Array.from(
      new TextEncoder().encode(string),
      byte => byte.toString(16).padStart(2, "0")
    ).join("");
  }

  const filter_accepted = (topic1, index) => {
    let filter1 = allAccepteddata?.filter(each =>
      each.topic2 == topic1 &
      each.data?.slice(66,130) == index 
    )
    return (filter1?.length ) ? true :false 
  }  




  return (
    <div className="marketdatacontainer">
      <h1>Marketplace</h1>
      <h3>accept the invites to complete the created bets</h3>
      <div className="allmatchescontainer">
        <div className="matchheader">
          <p className="id">match id</p>
          <p className="creatertxn">created-tx</p>
          <p className="createraddress">creater-address</p>
          <p className="createrusername">creater-username</p>
          <p className="createdAt">createdAt( GMT/ UTC)</p>
          <p className="betvalue">bet-stakes( Matic)</p>
          <p className="acceptInvite">accept-Invite</p>
        </div>
        {
          allMatchdata && allMatchdata.map((each,i) => {
            let already_accepted = filter_accepted(each.topic1, each.data.slice(66,130))
            let createdby_me = each.topic1 === `0x000000000000000000000000${(address.toLowerCase())?.slice(2)}`

            return (

              (!already_accepted && !createdby_me) &&
              <div className="eachmatch" key={i}>
                <p className="id">{allMatchdata.length - i}</p>
                <a className="creatertxn" href={`https://mumbai.polygonscan.com/tx/${each.transaction_hash}`} target="_blank" rel="noopener noreferrer" >View transaction</a>
                <a className="createraddress" href={`https://mumbai.polygonscan.com/address/0x${(each.topic1.slice(26))}`} target="_blank" rel="noopener noreferrer">{`0x${(each.topic1.slice(26).slice(0,3))}...${(each.topic1.slice(26).slice(36))}`}</a>
                <p className="createrusername">{`${ethers.utils.parseBytes32String(`0x${each.data?.slice(258,322)}`)}`}</p>
                <p className="createdAt">{getUTCtime(each.block_timestamp)}</p>
                <p className="betvalue">{`${parseInt(`0x${each.data?.slice(130,194)}`) / 1e18}`}</p>
                {accept_txnhash ? <a href={accept_txnhash} target="_blank" rel="noopener noreferrer"><button className='registerbutton'>{isAccepted ? 'Accepted': 'View on '}<img src="https://etherscan.io/images/brandassets/etherscan-logo-light-circle.png" alt="" /></button> </a>
                : <button className="acceptInvite" onClick={() => acceptInvite(each.data, each.topic1 )}> accept</button>
                }

              </div>
            )
          })
          
        }
      </div>
    </div>
  )
}

export default Market










// const options = {method: 'GET'};
//       fetch(`https://api-testnet.polygonscan.com/api?module=logs&action=getLogs&fromBlock=28997970&toBlock=latest&address=0x7ea1BF0fDE4f5C6EEb0893D0Ed9b9E6b85e5A147&topic0=0x18a6777340b2db1ada9763300dc0b7eb92a9624bfd688586807af4f475d341f0&apikey=${process.env.REACT_APP_ETHERSCAN_APIKEY}`, options)
//       .then(response => response.json())
//       .then(response => {
        
//         console.log('created' ,response)
//         response.status != 0 ? setcurrentIndex(response.result.length) : setcurrentIndex(0)
        
//       })
//       .catch(err => console.error(err));