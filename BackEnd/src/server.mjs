import { app } from './app.mjs';
import blockchainRoutes from './routes/blockchain-routes.mjs';
import transactionRoutes from './routes/transaction-routes.mjs';
import networkServer from './network.mjs';
import Blockchain from './models/blockchain/Blockchain.mjs';
import TransactionPool from './models/wallet/TransactionPool.mjs';
import Wallet from './models/wallet/Wallet.mjs';


const DEFAULT_PORT = 3000;
let NODE_PORT;

export const blockChain = new Blockchain();
export const transactionPool = new TransactionPool();
export const wallet = new Wallet();

export const server = new networkServer({
  blockchain: blockChain,
  transactionPool,
  wallet,
});

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

// Assign dynamic port
if (process.env.GENERATE_NODE_PORT === 'true') {
  NODE_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

// const PORT = NODE_PORT || DEFAULT_PORT;
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


