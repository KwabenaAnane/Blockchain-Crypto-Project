import Transaction from './Transaction.mjs';
import TransactionModel from '../schemas/transactionModel.mjs';

export default class TransactionPool {
  constructor() {
    this.transactionMap = {};
  }

  async addTransaction(transaction) {
    this.transactionMap[transaction.id] = transaction;

    // Upsert transaction in MongoDB
    await TransactionModel.findOneAndUpdate(
      { id: transaction.id },
      transaction,
      { upsert: true, new: true }
    );
  }
  clearBlockTransactions({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      for (let transaction of block.data) {
        if (this.transactionMap[transaction.id]) {
          delete this.transactionMap[transaction.id];
        }
      }
    }
  }

  clearTransactions() {
    this.transactionMap = {};
  }

 async replaceMap(transactionMap) {
    this.transactionMap = transactionMap;
  }

  transactionExists({ address }) {
    const transactions = Object.values(this.transactionMap);
    return transactions.find(
      (transaction) => transaction.input.address === address
    );
  }

  validateTransactions() {
    return Object.values(this.transactionMap).filter((transaction) =>
      Transaction.validate(transaction)
    );
  }
}
