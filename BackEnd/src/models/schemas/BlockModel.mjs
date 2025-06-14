import mongoose from 'mongoose';

const BlockSchema = new mongoose.Schema({
  timestamp: Number,
  hash: String,
  lastHash: String,
  data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  nonce: Number,
  difficulty: Number,
});

const BlockModel = mongoose.model('Block', BlockSchema);

export default BlockModel;
