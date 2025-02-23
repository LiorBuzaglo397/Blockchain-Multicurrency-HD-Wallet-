import Web3 from "web3";

// 🔧 Infura API Key
const INFURA_API_KEY = "8556c67194bc4af989e4a0876f20a8ab";

// ✅ RPC URLs
const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
const AVAX_RPC_URL = `https://avalanche-fuji.infura.io/v3/${INFURA_API_KEY}`;
const MTW_RPC_URL = "https://net.mtw-testnet.com";

// ✅ Blockchain Explorers (for transactions)
const ETHERSCAN_API_KEY = "ZU65QFWEEJYCFB4ZSR4I4I6FPXT4YWHCA3";
const AVAXSCAN_API_KEY = "0x9f5d3e025f862170E21fcA79DbB01B2CE2814B0d";
const MTW_EXPLORER_URL = "https://blockexplorer.morethanwallet.com/api";

// ✅ Web3 Instances
const web3Instances = {
  ETH: new Web3(new Web3.providers.HttpProvider(SEPOLIA_RPC_URL)),
  AVAX: new Web3(new Web3.providers.HttpProvider(AVAX_RPC_URL)),
  MTW: new Web3(new Web3.providers.HttpProvider(MTW_RPC_URL)),
};

/**
 * ✅ Get Web3 instance based on the selected blockchain
 * @param {string} coin - "ETH" | "AVAX" | "MTW"
 * @returns {Web3} - Web3 instance
 */
export function getWeb3Instance(coin) {
  if (!web3Instances[coin]) {
    throw new Error(`❌ Unsupported coin type: ${coin}`);
  }
  return web3Instances[coin];
}

/**
 * ✅ Fetch account balance for ETH, AVAX, or MTW
 * @param {string} coin - "ETH" | "AVAX" | "MTW"
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
 * ✅ Send a Signed Blockchain Transaction
 * @param {string} coin - "ETH" | "AVAX" | "MTW"
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

    // Validate recipient address
    if (!web3.utils.isAddress(recipient)) {
      throw new Error("🚨 Invalid recipient address");
    }

    // 🔹 Convert private key to account
    const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
    const sender = senderAccount.address;

    console.log(`🚀 Sending ${amount} ${coin} from ${sender} to ${recipient}...`);

    const nonce = await web3.eth.getTransactionCount(sender, "latest");
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 21000; // Standard for simple transfers

    const tx = {
      from: sender,
      to: recipient,
      value: web3.utils.toWei(amount.toString(), "ether"),
      gas: gasLimit,
      gasPrice,
      nonce,
    };

    // 🔹 Create, sign, and send transaction
    const signedTx = await senderAccount.signTransaction(tx);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    console.log(`✅ Transaction successful: ${receipt.transactionHash}`);
    return receipt.transactionHash;
  } catch (error) {
    console.error("❌ Error sending transaction:", error);
    throw new Error(error.message || "Transaction failed.");
  }
}
