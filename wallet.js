const INFURA_PROJECT_ID = '8556c67194bc4af989e4a0876f20a8ab'; // Replace with your Infura Project ID
const ETH_NODE_URL = `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`;

// Function to create or restore an Ethereum account
function createOrRestoreAccount(mnemonic) {
  try {
    // Use ethers.js Wallet class to create or restore account
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);
    console.log('Wallet Address:', wallet.address);
    return wallet;
  } catch (error) {
    console.error('Error creating/restoring wallet:', error);
    throw error;
  }
}

// Function to check Ethereum balance
async function getEthBalance(walletAddress) {
  try {
    const provider = new ethers.JsonRpcProvider(ETH_NODE_URL);
    const balanceWei = await provider.getBalance(walletAddress);
    const balanceEth = ethers.formatEther(balanceWei);
    console.log(`Balance of ${walletAddress}: ${balanceEth} ETH`);
    print("bob");
    return balanceEth;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}

// Function to send Ethereum transaction
async function sendEthTransaction(privateKey, recipient, amount) {
  try {
    const provider = new ethers.JsonRpcProvider(ETH_NODE_URL);
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to: recipient,
      value: ethers.parseEther(amount.toString()), // Convert amount to wei
    };

    const transaction = await wallet.sendTransaction(tx);
    console.log('Transaction sent:', transaction.hash);

    // Wait for confirmation
    const receipt = await transaction.wait();
    console.log('Transaction confirmed:', receipt);
    return receipt;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
}

// Function to get transaction history (requires etherscan or another explorer API)
async function getTransactionHistory(walletAddress) {
  console.error(
    'Transaction history requires a blockchain explorer API (e.g., Etherscan).'
  );
  // You can integrate Etherscan API here if needed
}

// Function to connect to MetaMask and get user balance
async function connectToMetaMask() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const address = accounts[0];
      console.log('Connected to MetaMask:', address);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      console.log(`MetaMask Balance: ${balanceEth} ETH`);
      return { address, balanceEth };
    } else {
      throw new Error('MetaMask extension not detected');
    }
  } catch (error) {
    console.error('Failed to connect to MetaMask:', error);
    throw error;
  }
}
