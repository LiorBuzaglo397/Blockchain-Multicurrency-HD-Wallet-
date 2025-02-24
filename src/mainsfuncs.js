import Web3 from "web3";
import { sendTransaction } from "./blockchain"; 


export const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/f4a064381a4145aea1b2bfd4bd620456"
  )
);

export const web3AVAX = new Web3(
  "https://avalanche-fuji.infura.io/v3/f4a064381a4145aea1b2bfd4bd620456"
);

export function login(username, password) {
  const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
  const loggedInUser = allUsers.find((user) => user.isLoggedIn);
  
  if (loggedInUser) {
    return "Another user is already logged in. Logout before logging in.";
  }

  const user = allUsers.find((user) => user.username === username && user.password === password);

  if (!user) {
    return "Invalid Username or Password";
  }

  user.isLoggedIn = true;
  localStorage.setItem("userData", JSON.stringify(allUsers));

  return "Login Successful. Redirecting...";
}

export function logOut() {
  const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
  const loggedInUser = allUsers.find((user) => user.isLoggedIn);

  if (loggedInUser) {
    loggedInUser.isLoggedIn = false;
  }

  localStorage.setItem("userData", JSON.stringify(allUsers));
}
export function restoreAccount(seedPhrase, newPassword) {
  let allUsers = JSON.parse(localStorage.getItem("users")) || [];

  if (!Array.isArray(allUsers)) {
      allUsers = [];
  }

  const userWallet = allUsers.find((user) => user.seedPhrase === seedPhrase);

  if (!userWallet) {
      return "❌ Seed Phrase not found! Please try again.";
  }

  // 🔄 עדכון סיסמה ושמירה ב- localStorage
  userWallet.password = newPassword;
  userWallet.isLoggedIn = true;
  localStorage.setItem("users", JSON.stringify(allUsers));
  localStorage.setItem("currentUser", JSON.stringify(userWallet));

  return "✅ Account restored successfully! Redirecting...";
}

  /**
   * @param {string} recipient - Receiver's wallet address
   * @param {number} amount - Amount to send
   * @param {string} coin - "ETH" | "AVAX" | "MTW"
   * @param {function} setMessage - Function to update UI message
   */
  export async function sendCoins(recipient, amount, coin, setMessage) {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser || !currentUser.privateKey) {
        throw new Error("🚨 No user logged in or missing private key!");
      }
  
      const privateKey = currentUser.privateKey;
  
      if (!recipient || !amount || !coin) {
        throw new Error("🚨 Missing transaction parameters");
      }
  
      console.log(`🚀 Initiating transfer: ${amount} ${coin} to ${recipient}`);
  
      const txHash = await sendTransaction(coin, privateKey, recipient, amount);
  
      setMessage(`✅ Transaction Successful! TX: ${txHash}`);
      console.log(`✅ Transaction Hash: ${txHash}`);
    } catch (error) {
      console.error("❌ Error sending coins:", error.message);
      setMessage(`❌ Error: ${error.message}`);
    }
  }
  

  
  export function fetchTransactions() {
    var allUsers = JSON.parse(localStorage.getItem("userData")) || [];
    var loggedInUser = allUsers.find((user) => user.isLoggedIn);
  
    if (!loggedInUser) {
      return [];
    }
    
    return loggedInUser.transactions || [];
  }
  
export function createAccount(username, password) {
  const seedPhrase = window.lightwallet.keystore.generateRandomSeed();

  return new Promise((resolve, reject) => {
    window.lightwallet.keystore.createVault(
      {
        password,
        seedPhrase,
        hdPathString: "m/44'/60'/0'/0",
      },
      function (err, keyStore) {
        if (err) return reject(err);

        keyStore.keyFromPassword(password, function (err, pwDerivedKey) {
          if (err) return reject(err);
          
          keyStore.generateNewAddress(pwDerivedKey, 1);
          const addr = keyStore.getAddresses()[0];

          const userData = {
            username,
            password,
            address: addr,
            seedPhrase,
            isLoggedIn: true,
            serializedKeystore: keyStore.serialize(),
            transactions: [],
          };

          const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
          allUsers.push(userData);
          localStorage.setItem("userData", JSON.stringify(allUsers));

          resolve({ address: addr, seedPhrase });
        });
      }
    );
  });
}

export async function getETHBalance() {
  const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
  const loggedInUser = allUsers.find((user) => user.isLoggedIn);

  if (!loggedInUser) {
    console.log("No logged in user found");
    return null;
  }

  const balanceWei = await web3.eth.getBalance(loggedInUser.address);
  return web3.utils.fromWei(balanceWei, "ether");
}

export async function getAVAXBalance() {
  const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
  const loggedInUser = allUsers.find((user) => user.isLoggedIn);

  if (!loggedInUser) {
    console.log("No logged in user found");
    return null;
  }

  const balanceWei = await web3AVAX.eth.getBalance(loggedInUser.address);
  return web3AVAX.utils.fromWei(balanceWei, "ether");
}

export function checkLoginStatus() {
  const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
  return allUsers.find((user) => user.isLoggedIn) || null;
}

export function getEthPrice() {
  return fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
    .then((response) => response.json())
    .then((data) => data.ethereum.usd)
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
}

export function getAvaxPrice() {
  return fetch("https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd")
    .then((response) => response.json())
    .then((data) => data["avalanche-2"].usd)
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
}
