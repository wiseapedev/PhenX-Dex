import uniswapV3FactoryABI from '../abis/uniswapFactory.json';

const provider = new JsonRpcProvider(process.env.RPC_URL); // Replace with your Ethereum node provider URL

const UNISWAP_V3_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'; // Mainnet factory address

const uniswapV3Factory = new Contract(
  UNISWAP_V3_FACTORY_ADDRESS,
  uniswapV3FactoryABI,
  provider
);

// Common fee tiers in Uniswap V3
const feeTiers = [500, 3000, 10000];

export async function checkIfPoolsExist(tokenA, tokenB) {
  for (let fee of feeTiers) {
    const poolAddressAtoB = await uniswapV3Factory.getPool(tokenA, tokenB, fee);
    const poolAddressBtoA = await uniswapV3Factory.getPool(tokenB, tokenA, fee);

    if (poolAddressAtoB !== '0x0000000000000000000000000000000000000000') {
      console.log(`Pool exists for ${tokenA}/${tokenB} at fee tier ${fee}`);
      return fee;
    }

    if (poolAddressBtoA !== '0x0000000000000000000000000000000000000000') {
      console.log(`Pool exists for ${tokenB}/${tokenA} at fee tier ${fee}`);
      return fee;
    }
  }
  return false;
}
