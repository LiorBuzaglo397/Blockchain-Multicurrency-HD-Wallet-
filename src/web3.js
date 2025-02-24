import Web3 from "web3";

const INFURA_API_KEY = "8556c67194bc4af989e4a0876f20a8ab";

const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
const AVAX_RPC_URL = `https://avalanche-fuji.infura.io/v3/${INFURA_API_KEY}`;
const MTW_RPC_URL = "https://net.mtw-testnet.com";

const ETHERSCAN_API_KEY = "ZU65QFWEEJYCFB4ZSR4I4I6FPXT4YWHCA3";
const AVAXSCAN_API_KEY = "YOUR_AVAXSCAN_API_KEY";
const MTW_EXPLORER_URL = "https://blockexplorer.morethanwallet.com/api";

// ✅ Web3 Instances
const web3Eth = new Web3(new Web3.providers.HttpProvider(SEPOLIA_RPC_URL));
const web3Avax = new Web3(new Web3.providers.HttpProvider(AVAX_RPC_URL));
const web3Mtw = new Web3(new Web3.providers.HttpProvider(MTW_RPC_URL));

/**
 * @param {string} coin - "ETH" | "AVAX" | "MTW"
 * @returns {Web3} - Web3 instance for the specified blockchain
 */
function getWeb3Instance(coin) {
  switch (coin) {
    case "ETH":
      return web3Eth;
    case "AVAX":
      return web3Avax;
    case "MTW":
      return web3Mtw;
    default:
      throw new Error("❌ Invalid coin type");
  }
}

/**
 * @param {string} coin - "ETH" | "AVAX" 
 * @param {string} address - Wallet address
 * @returns {Promise<string>} - Balance in respective token
 */
export async function checkBalance(coin, address) {
  if (!address) throw new Error("❌ Address is required!");

  try {
    const web3 = getWeb3Instance(coin);
    const balanceWei = await web3.eth.getBalance(address);
    const balance = Web3.utils.fromWei(balanceWei, "ether");

    console.log(`✅ ${coin} balance: ${balance}`);
    return balance;
  } catch (error) {
    console.error(`❌ Error fetching balance for ${coin}:`, error.message);
    return "Error fetching balance";
  }
}

/**
 * @param {string} coin - "ETH" | "AVAX" 
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
 * @param {string} coin - "ETH" | "AVAX" 
 * @param {string} privateKey - Sender's private key
 * @param {string} recipient - Receiver's wallet address
 * @param {number} amount - Amount to send
 * @returns {Promise<string>} - Transaction ID (TXID)
 */
export async function sendTransaction(coin, privateKey, recipient, amount) {
  if (!privateKey || !recipient || !amount) {
    throw new Error("🚨 Missing transaction parameters");
  }

  try {
    const web3 = getWeb3Instance(coin);

    if (!web3.utils.isAddress(recipient)) {
      throw new Error("🚨 Invalid recipient address");
    }

    const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    const sender = senderAccount.address;

    console.log(`🚀 Sending ${amount} ${coin} from ${sender} to ${recipient}...`);

    const nonce = await web3.eth.getTransactionCount(sender, "latest");
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 21000; 

    const tx = {
      from: sender,
      to: recipient,
      value: web3.utils.toWei(amount.toString(), "ether"),
      gas: gasLimit,
      gasPrice,
      nonce,
    };

    const signedTx = await senderAccount.signTransaction(tx);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`✅ Transaction successful: ${receipt.transactionHash}`);
    return receipt.transactionHash;
  } catch (error) {
    console.error("❌ Error sending transaction:", error);
    throw new Error(error.message || "Transaction failed.");
  }
}

/**
 * @param {string} address - Wallet address
 * @returns {Promise<string>} - Balance in wETH 
 */
export async function checkMtwBalance(address) {
  return checkBalance("MTW", address);
}

/**
 * @param {string} address - Wallet address
 * @returns {Promise<Object[]>} - Transaction history array
 */
export async function getMtwTransactionHistory(address) {
  return getTransactionHistory("MTW", address);
}
