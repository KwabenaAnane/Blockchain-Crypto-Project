import { app } from './app.mjs';
import blockchainRoutes from './routes/blockchain-routes.mjs';
import transactionRoutes from './routes/transaction-routes.mjs';
import Blockchain from './models/blockchain/Blockchain.mjs';
import TransactionPool from './models/wallet/TransactionPool.mjs';
import Wallet from './models/wallet/Wallet.mjs';
import Network from './network.mjs';


const DEFAULT_PORT = 3000;
let NODE_PORT;

export const blockChain = new Blockchain();
export const wallet = new Wallet();
export const transactionPool = new TransactionPool({ network: null });


export const server = new Network({
  blockchain: blockChain,
  transactionPool,
  wallet,
});

await blockChain.loadChainFromDB();

transactionPool.network = server;

app.use('/api/blocks', blockchainRoutes);
app.use('/api/wallet', transactionRoutes);


const synchronize = async () => {
  const ROOT_NODE = `http://localhost:${DEFAULT_PORT}`;

  try {
    let response = await fetch(`${ROOT_NODE}/api/blocks`);
    if (response.ok) {
      const result = await response.json();
      blockChain.replaceChain(result.data);
    }

    response = await fetch(`${ROOT_NODE}/api/wallet/transactions`);
    if (response.ok) {
      const result = await response.json();
      transactionPool.replaceMap(result.data);
    }
  } catch (error) {
    console.error('Failed to sync with root node:', error.message);
  }
};

if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || NODE_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(
    `HTTP server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );

  if (PORT !== DEFAULT_PORT) {
    synchronize();
  }


  server.listen();
});
