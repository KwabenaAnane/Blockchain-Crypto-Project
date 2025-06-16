import { createHash } from '../../utilities/hash.mjs';
import Block from './Block.mjs';
import Transaction from '../wallet/Transaction.mjs';
import Wallet from '../wallet/Wallet.mjs';
import { REWARD_ADDRESS, MINING_REWARD } from '../../utilities/config.mjs';
import BlockModel from '../schemas/blockModel.mjs';
import TransactionModel from '../schemas/transactionModel.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

 async addBlock({ data }) {
    
    const savedTransactions = await Promise.all(
      data.map(tx => new TransactionModel(tx).save())
    );

    const transactionIds = savedTransactions.map(tx => tx._id);

    const addedBlock = Block.mineBlock({
      previousBlock: this.chain.at(-1),
      data: transactionIds,
    });

    this.chain.push(addedBlock);

    await new BlockModel(addedBlock).save();
  }

  async loadChainFromDB() {
    const blocks = await BlockModel.find()
      .sort({ timestamp: 1 })
      .populate('data') // populates data field with full transactions
      .lean();

    if (blocks.length > 0) {
      this.chain = blocks;
    }
  }

  replaceChain(chain, callback) {
    if (chain.length <= this.chain.length) return;

    if (!Blockchain.isValid(chain)) return;

    if (callback) callback();

    this.chain = chain;
  }

  validateTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      let rewardCount = 0;

      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_ADDRESS.address) {
          rewardCount += 1;

          // Regel 1: Kontrollera om det finns fler belöningstransaktion än 1.
          if (rewardCount > 1) {
            console.error('Too many rewards');
            return false;
          }
        }
      }
    }
    return true;
  }

  static isValid(chain) {
    if (JSON.stringify(chain.at(0)) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    // Testa hela kedjan för att hitta eventuella felaktigheter...
    for (let i = 1; i < chain.length; i++) {
      const { timestamp, data, hash, lastHash, nonce, difficulty } =
        chain.at(i);
      const prevHash = chain[i - 1].hash;

      if (lastHash !== prevHash) return false;

      const validHash = createHash(
        timestamp,
        data,
        lastHash,
        nonce,
        difficulty
      );
      if (hash !== validHash) return false;
    }

    return true;
  }
}
