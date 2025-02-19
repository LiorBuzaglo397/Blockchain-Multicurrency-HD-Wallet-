import Web3 from "web3";

// Web3 Initialization with Infura
export const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://sepolia.infura.io/v3/f4a064381a4145aea1b2bfd4bd620456"
  )
);

export const web3AVAX = new Web3(
  "https://avalanche-fuji.infura.io/v3/f4a064381a4145aea1b2bfd4bd620456"
);

// פונקציה לטיפול בהתחברות המשתמש
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

// פונקציה לטיפול בהתנתקות המשתמש
export function logOut() {
  const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
  const loggedInUser = allUsers.find((user) => user.isLoggedIn);

  if (loggedInUser) {
    loggedInUser.isLoggedIn = false;
  }

  localStorage.setItem("userData", JSON.stringify(allUsers));
}
export function restoreAccount(seedPhraseInput, newPassword) {
    var allUsers = JSON.parse(localStorage.getItem("userData")) || [];
  
    var loggedInUser = allUsers.find((user) => user.isLoggedIn);
    if (loggedInUser) {
      return "A user is already logged in";
    }
  
    var user = allUsers.find((user) => user.seedPhrase === seedPhraseInput);
  
    if (user) {
      user.password = newPassword;
      user.isLoggedIn = true;
      localStorage.setItem("userData", JSON.stringify(allUsers));
      return "Successfully logged in, password is restored!";
    } else {
      return "No user found with the given seed phrase";
    }
  }

  export function sendCoins(recipient, amount, coin, setMessage) {
    var allUsers = JSON.parse(localStorage.getItem("userData")) || [];
    var loggedInUser = allUsers.find((user) => user.isLoggedIn);
  
    if (!loggedInUser) {
      setMessage("No logged in user found.");
      return;
    }
  
    var transaction = {
      from: loggedInUser.address,
      to: recipient,
      value: amount,
      type: coin,
    };
  
    if (!loggedInUser.transactions) {
      loggedInUser.transactions = [];
    }
  
    loggedInUser.transactions.push(transaction);
  
    var recipientUser = allUsers.find((user) => user.address === recipient);
    if (recipientUser) {
      if (!recipientUser.transactions) {
        recipientUser.transactions = [];
      }
      recipientUser.transactions.push(transaction);
    }
  
    localStorage.setItem("userData", JSON.stringify(allUsers));
  
    setMessage(`Transaction successful! Sent ${amount} ${coin} to ${recipient}`);
  }
  
  export function fetchTransactions() {
    var allUsers = JSON.parse(localStorage.getItem("userData")) || [];
    var loggedInUser = allUsers.find((user) => user.isLoggedIn);
  
    if (!loggedInUser) {
      return [];
    }
    
    return loggedInUser.transactions || [];
  }
  
// פונקציה ליצירת ארנק חדש
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

// פונקציה לקבלת יתרת ה-ETH
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

// פונקציה לקבלת יתרת ה-AVAX
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

// פונקציה לבדיקה אם המשתמש מחובר
export function checkLoginStatus() {
  const allUsers = JSON.parse(localStorage.getItem("userData")) || [];
  return allUsers.find((user) => user.isLoggedIn) || null;
}

// פונקציה לקבלת מחיר ETH
export function getEthPrice() {
  return fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
    .then((response) => response.json())
    .then((data) => data.ethereum.usd)
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
}

// פונקציה לקבלת מחיר AVAX
export function getAvaxPrice() {
  return fetch("https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd")
    .then((response) => response.json())
    .then((data) => data["avalanche-2"].usd)
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
}
