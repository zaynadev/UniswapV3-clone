const { ethers, BigNumber } = require("ethers");

const {
  AlphaRouter,
  ChainId,
  SwapType,
} = require("@uniswap/smart-order-router");
const {
  Token,
  CurrencyAmount,
  TradeType,
  Percent,
} = require("@uniswap/sdk-core");
const JSBI = require("jsbi");
const ERC20ABI = require("./utils/erc20Abi.json");

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";

//hardhat network (with mainnet fork)
export const _provider = new ethers.providers.JsonRpcProvider(
  "http://127.0.0.1:8545/"
);

const chainId = ChainId.MAINNET;
const name0 = "Wrapped Ether";
const symbol0 = "WETH";
const decimals0 = 18;
const address0 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

const name1 = "Uniswap Token";
const symbol1 = "UNI";
const decimals1 = 18;
const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

const WETH = new Token(chainId, address0, decimals0, symbol0, name0);
const UNI = new Token(chainId, address1, decimals1, symbol1, name1);

const router = new AlphaRouter({ chainId, provider: _provider });

export const getWethContract = () =>
  new ethers.Contract(address0, ERC20ABI, _provider);
export const getUniContract = () =>
  new ethers.Contract(address1, ERC20ABI, _provider);

export const getPrice = async (
  inputAmount,
  slippageAmount,
  deadline,
  walletAddress
) => {
  console.log({ inputAmount, slippageAmount, deadline, walletAddress });
  const percentSlippage = new Percent(slippageAmount, 100);
  const wei = ethers.utils.parseUnits(inputAmount.toString(), decimals0);
  const currencyAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei));
  console.log("*** before ***");
  try {
    const route = await router.route(
      currencyAmount,
      UNI,
      TradeType.EXACT_INPUT,
      {
        recipient: walletAddress,
        slippageTolerance: percentSlippage,
        deadline: deadline,
        type: SwapType.SWAP_ROUTER_02,
      }
    );
    console.log("*** after ***");
    console.log({ route });
    // initiate the transaction
    const transaction = {
      data: route.methodParameters.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: BigNumber.from(route.methodParameters.value),
      from: walletAddress,
      gasPrice: BigNumber.from(route.gasPriceWei),
      gasLimit: ethers.utils.hexlify(1000000),
    };
    console.log({ transaction });
    // get the amount out
    const quoteAmountOut = route.quote.toFixed(6);
    //get ratio
    const ratio = (inputAmount / quoteAmountOut).toFixed(3);
    return [transaction, quoteAmountOut, ratio];
  } catch (error) {
    console.log("*** route *** ", error);
  }
};

export const runSwap = async (transaction, signer) => {
  const approvalAmount = ethers.utils.parseUnits("10", 18).toString();
  const contract0 = getWethContract();
  await contract0
    .connect(signer)
    .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount);
  signer.sendTransaction(transaction);
};
