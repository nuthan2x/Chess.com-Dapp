const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");
async function main() {
// Verify the contract after deploying
await ethers.run("verify:verify", {
address: "0x6b70Aab27cEBDb1C5206a02094d11fE4c347c40D",
constructorArguments: [],
});
}
// Call the main function and catch if there is any error
main()
.then(() => process.exit(0))
.catch((error) => {
console.error(error);
process.exit(1);
});