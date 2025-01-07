<<<<<<< HEAD
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
=======
const API_KEY = '99a405ef-dc6c-4225-99cd-76595f84d46f';
const ETH_NODE_URL = 'https://eth-goerli.nownodes.io/v1';
const ETH_EXPLORER_URL = 'https://ethbook-goerli.nownodes.io/v1';

const LTC_NODE_URL = 'https://ltc-testnet.nownodes.io/v1';
const LTC_EXPLORER_URL = 'https://ltcbook-testnet.nownodes.io/v1';

// Function to create or restore an account
function createOrRestoreAccount(mnemonic, coin) {
  let url, nodeUrl;
  
  if (coin === 'ETH') {
    url = `${ETH_NODE_URL}/account/create?mnemonic=${mnemonic}&coin=${coin}&key=${API_KEY}`;
    nodeUrl = ETH_NODE_URL;
  } else if (coin === 'LTC') {
    url = `${LTC_NODE_URL}/account/create?mnemonic=${mnemonic}&coin=${coin}&key=${API_KEY}`;
    nodeUrl = LTC_NODE_URL;
  } else {
    throw new Error('Invalid coin specified');
  }

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        return {
          address: data.data.address,
          nodeUrl: nodeUrl
        };
      } else {
        throw new Error(data.error);
      }
    });
}

// Function to check balances
function checkBalances(coin, nodeUrl) {
  let url;

  if (coin === 'ETH') {
    url = `${ETH_NODE_URL}/account/balance?coin=${coin}&key=${API_KEY}`;
  } else if (coin === 'LTC') {
    url = `${LTC_NODE_URL}/account/balance?coin=${coin}&key=${API_KEY}`;
  } else {
    throw new Error('Invalid coin specified');
  }

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const balances = data.data.balances;
        return balances;
      } else {
        throw new Error(data.error);
      }
    });
}

// Function to send a signed transaction
function sendSignedTransaction(coin, recipient, amount, nodeUrl) {
  let url;

  if (coin === 'ETH') {
    url = `${ETH_NODE_URL}/transaction/send?coin=${coin}&recipient=${recipient}&amount=${amount}&key=${API_KEY}`;
  } else if (coin === 'LTC') {
    url = `${LTC_NODE_URL}/transaction/send?coin=${coin}&recipient=${recipient}&amount=${amount}&key=${API_KEY}`;
  } else {
    throw new Error('Invalid coin specified');
  }

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        return data.data.txid;
      } else {
        throw new Error(data.error);
      }
    });
}

// Function to get transaction history
function getTransactionHistory(coin, nodeUrl) {
  let url;

  if (coin === 'ETH') {
    url = `${ETH_EXPLORER_URL}/transactions?coin=${coin}&key=${API_KEY}`;
  } else if (coin === 'LTC') {
    url = `${LTC_EXPLORER_URL}/transactions?coin=${coin}&key=${API_KEY}`;
  } else {
    throw new Error('Invalid coin specified');
  }

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const transactions = data.data;
        return transactions;
      } else {
        throw new Error(data.error);
      }
    });
}


// Function to connect to MetaMask and initialize web3
function connectToMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          // Accounts now contains an array of available accounts
          const address = accounts[0];
          console.log('Connected to MetaMask:', address);
  
          // Initialize web3 with MetaMask provider
          web3 = new Web3(window.ethereum);
        })
        .catch(error => {
          console.error('Failed to connect to MetaMask:', error);
        });
    } else {
      console.error('MetaMask extension not detected');
    }
  }
  
  // Function to send an Ethereum transaction using MetaMask
  function sendEthTransaction(recipient, amount) {
    if (typeof web3 !== 'undefined') {
      web3.eth.sendTransaction({
        to: recipient,
        value: web3.utils.toWei(amount.toString(), 'ether'),
      })
        .then(receipt => {
          console.log('Transaction successful:', receipt);
        })
        .catch(error => {
          console.error('Failed to send transaction:', error);
        });
    } else {
      console.error('Web3 not initialized');
    }
  }
  
// Function to display transaction history
function displayTransactionHistory(coin, nodeUrl) {
  getTransactionHistory(coin, nodeUrl)
    .then(transactions => {
      const transactionListElement = document.getElementById('transactionList');
      transactionListElement.innerHTML = '';

      transactions.forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.classList.add('transaction');
        transactionElement.innerHTML = `
          <h3>Transaction ID: ${transaction.txid}</h3>
          <p>Amount: ${transaction.amount}</p>
          <p>Sender: ${transaction.sender}</p>
          <p>Recipient: ${transaction.recipient}</p>
          <p>Timestamp: ${transaction.timestamp}</p>
        `;

        transactionListElement.appendChild(transactionElement);
      });
    })
    .catch(error => {
      console.error('Failed to fetch transaction history:', error);
    });
}


>>>>>>> c681791 (cleaning the code)
