const { ethers } = require("hardhat");
const ERC20ABI = require("./erc20Abi.json");
const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

const sendEthFaucets = async () => {
  const signers = await ethers.getSigners();
  const wethContract = await ethers.getContractAt(ERC20ABI, WETH_ADDRESS);
  const impersonatedSigner = await ethers.getImpersonatedSigner(
    "0x56178a0d5F301bAf6CF3e1Cd53d9863437345Bf9"
  );
  await wethContract
    .connect(impersonatedSigner)
    .transfer(signers[0].address, ethers.utils.parseEther("10"));

  console.log(`${signers[0].address} has now 10 WETH faucet`);
};

sendEthFaucets();
