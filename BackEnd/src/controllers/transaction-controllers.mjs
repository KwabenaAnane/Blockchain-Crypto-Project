import { transactionPool, wallet, server, blockChain } from '../server.mjs';
import Miner from '../models/miner/Miner.mjs';
import Wallet from '../models/wallet/Wallet.mjs';

export const addTransaction = async (req, res) => {
  const { amount, recipient } = req.body;
  let transaction = transactionPool.transactionExists({
    address: wallet.publicKey,
  });

  try {
    if (transaction) {
      transaction.update({ sender: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, statusCode: 400, error: error.message });
  }

  await transactionPool.addTransaction(transaction);
  server.broadcastTransaction(transaction);

  res.status(201).json({ success: true, statusCode: 201, data: transaction });
};

export const getWalletInfo = (req, res) => {
  const address = wallet.publicKey;
  const balance = Wallet.calculateBalance({
    chain: blockChain.chain,
    address: address,
  });

  res
    .status(200)
    .json({
      success: true,
      statusCode: 200,
      data: { address: address, balance: balance },
    });
};

export const listAllTransactions = async (req, res) => {
  try {
    const TransactionModel = (await import('../models/wallet/TransactionModel.mjs')).default;
    const transactions = await TransactionModel.find().lean();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const mineTransactions = (req, res) => {
  const miner = new Miner({
    transactionPool: transactionPool,
    wallet: wallet,
    blockchain: blockChain,
    server: server,
  });

  miner.mineTransactions();

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: 'Det verkar fungerar🤔.',
  });
};
