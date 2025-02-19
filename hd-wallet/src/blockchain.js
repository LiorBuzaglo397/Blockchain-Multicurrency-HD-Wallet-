// blockchain.js
const API_KEY = process.env.REACT_APP_NOWNODES_API_KEY;

const ETH_NODE_URL = "https://eth-goerli.nownodes.io/v1";
const ETH_EXPLORER_URL = "https://ethbook-goerli.nownodes.io/v1";
const LTC_NODE_URL = "https://ltc-testnet.nownodes.io/v1";
const LTC_EXPLORER_URL = "https://ltcbook-testnet.nownodes.io/v1";

// יצירת ארנק עם NOWNODES
export function createOrRestoreAccount(mnemonic, coin) {
  let baseUrl = coin === "ETH" ? ETH_NODE_URL : LTC_NODE_URL;
  let url = `${baseUrl}/account/create?mnemonic=${mnemonic}&coin=${coin}&key=${API_KEY}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        return { address: data.data.address, nodeUrl: baseUrl };
      } else {
        throw new Error(data.error || "Failed to create account");
      }
    });
}

// בדיקת יתרה
export function checkBalances(coin) {
  let baseUrl = coin === "ETH" ? ETH_NODE_URL : LTC_NODE_URL;
  let url = `${baseUrl}/account/balance?coin=${coin}&key=${API_KEY}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        return data.data.balances;
      } else {
        throw new Error(data.error);
      }
    });
}

// שליחת עסקה
export function sendSignedTransaction(coin, recipient, amount) {
  let baseUrl = coin === "ETH" ? ETH_NODE_URL : LTC_NODE_URL;
  let url = `${baseUrl}/transaction/send?coin=${coin}&recipient=${recipient}&amount=${amount}&key=${API_KEY}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        return data.data.txid;
      } else {
        throw new Error(data.error);
      }
    });
}

// היסטוריית עסקאות
export function getTransactionHistory(coin) {
  let baseUrl = coin === "ETH" ? ETH_EXPLORER_URL : LTC_EXPLORER_URL;
  let url = `${baseUrl}/transactions?coin=${coin}&key=${API_KEY}`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.error);
      }
    });
}
