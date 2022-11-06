require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  REPORT_GAS :true,
  etherscan: {
    apiKey: '4K4IZ7ZNY9B4H3GVWWC49P6GF3SDZ3XDJ9',
  },
  networks : {
    goerli : {
      url : "https://rpc.ankr.com/eth_goerli",
      accounts : [""],
    },
    mumbai : {
      url : 'https://rpc-mumbai.maticvigil.com/',
      accounts : [""],
    }

  }

};
