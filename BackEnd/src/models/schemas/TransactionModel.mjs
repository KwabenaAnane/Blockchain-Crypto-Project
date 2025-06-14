import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  input: {
    timestamp: Number,
    amount: Number,
    address: String,
    signature: String,
  },
  outputMap: mongoose.Schema.Types.Mixed,
});

const TransactionModel = mongoose.model('Transaction', TransactionSchema);

export default TransactionModel;
