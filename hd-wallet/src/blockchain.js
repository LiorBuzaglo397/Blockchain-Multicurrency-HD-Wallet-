import Web3 from "web3";

// 🔧 Infura API Key
const INFURA_API_KEY = "8556c67194bc4af989e4a0876f20a8ab";

// ✅ RPC URLs
const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
const AVAX_RPC_URL = `https://avalanche-fuji.infura.io/v3/${INFURA_API_KEY}`;
const MTW_RPC_URL = "https://net.mtw-testnet.com";

// ✅ Blockchain Explorers (for transactions)
const ETHERSCAN_API_KEY = "ZU65QFWEEJYCFB4ZSR4I4I6FPXT4YWHCA3";
const AVAXSCAN_API_KEY = "YOUR_AVAXSCAN_API_KEY";
const MTW_EXPLORER_URL = "https://blockexplorer.morethanwallet.com/api";

// ✅ Web3 Instances
const web3Eth = new Web3(new Web3.providers.HttpProvider(SEPOLIA_RPC_URL));
const web3Avax = new Web3(new Web3.providers.HttpProvider(AVAX_RPC_URL));
const web3Mtw = new Web3(new Web3.providers.HttpProvider(MTW_RPC_URL));

/**
 * ✅ Fetch account balance for ETH, AVAX, or MTW
 * @param {string} coin - "ETH" | "AVAX" | "MTW"
 * @param {string} address - Wallet address
 * @returns {Promise<string>} - Balance in respective token
 */
export async function checkBalance(coin, address) {
  if (!address) throw new Error("❌ Address is required!");

  try {
    let balanceWei;
    if (coin === "ETH") {
      balanceWei = await web3Eth.eth.getBalance(address);
    } else if (coin === "AVAX") {
      balanceWei = await web3Avax.eth.getBalance(address);
    } else if (coin === "MTW") {
      balanceWei = await web3Mtw.eth.getBalance(address);
    } else {
      throw new Error("❌ Invalid coin type");
    }

    const balance = Web3.utils.fromWei(balanceWei, "ether");
    console.log(`✅ ${coin} balance: ${balance}`);
    return balance;
  } catch (error) {
    console.error(`❌ Error fetching balance for ${coin}:`, error.message);
    return "Error fetching balance";
  }
}

/**
 * ✅ Fetch transaction history for ETH, AVAX, or MTW
 * @param {string} coin - "ETH" | "AVAX" | "MTW"
 * @param {string} address - Wallet address
 * @returns {Promise<Object[]>} - Array of transactions
 */
export async function getTransactionHistory(coin, address) {
  if (!address) throw new Error("🚨 Missing wallet address");

  let explorerUrl;
  if (coin === "ETH") {
    explorerUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
  } else if (coin === "AVAX") {
    explorerUrl = `https://api.snowtrace.io/api?module=account&action=txlist&address=${address}&apikey=${AVAXSCAN_API_KEY}`;
  } else if (coin === "MTW") {
    explorerUrl = `${MTW_EXPLORER_URL}?module=account&action=txlist&address=${address}`;
  } else {
    throw new Error("❌ Invalid coin type");
  }

  try {
    const response = await fetch(explorerUrl);
    const data = await response.json();
    if (!data.result) throw new Error("❌ Failed to fetch transactions");
    console.log(`✅ ${coin} Transactions:`, data.result);
    return data.result;
  } catch (error) {
    console.error(`❌ Error fetching transactions for ${coin}:`, error);
    return [];
  }
}

/**
 * ✅ Fetch MTW Balance
 * @param {string} address - Wallet address
 * @returns {Promise<string>} - Balance in wETH (MTW)
 */
export async function checkMtwBalance(address) {
  return checkBalance("MTW", address);
}

/**
 * ✅ Fetch MTW Transaction History
 * @param {string} address - Wallet address
 * @returns {Promise<Object[]>} - Transaction history array
 */
export async function getMtwTransactionHistory(address) {
  return getTransactionHistory("MTW", address);
}
