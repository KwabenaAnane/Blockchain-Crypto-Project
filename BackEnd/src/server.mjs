import { app } from './app.mjs';
import blockchainRoutes from './routes/blockchain-routes.mjs';
import transactionRoutes from './routes/transaction-routes.mjs';
import authRoutes from './routes/auth-routes.mjs';
import userRoutes from './routes/user-routes.mjs';
import Blockchain from './models/blockchain/Blockchain.mjs';
import TransactionPool from './models/wallet/TransactionPool.mjs';
import Wallet from './models/wallet/Wallet.mjs';
import Network from './network.mjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});


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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

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

const startServer = async () => {
  try {
    // Start the HTTP server
    const httpServer = app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
      
      if (PORT !== DEFAULT_PORT) {
        synchronize().catch(err => {
          console.error('Error during synchronization:', err);
        });
      }
      
      server.listen();
      console.log('✅ WebSocket server started');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! Shutting down...');
      console.error(err);
      httpServer.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM for graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      httpServer.close(() => {
        console.log('Process terminated!');
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Start the server
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
