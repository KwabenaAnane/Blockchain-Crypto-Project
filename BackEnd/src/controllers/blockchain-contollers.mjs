import { blockChain, server } from '../server.mjs';

export const listAllBlocks = async (req, res) => {
  res.status(200).json({ success: true, data: blockChain.chain });
};

export const addBlock = async (req, res) => {
  const { data } = req.body;

  try {
    await blockChain.addBlock({ data });
    server.broadcastChain();

    res.status(201).json({
      success: true,
      message: 'Block is added',
      data: blockChain.chain,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add block',
      error: error.message,
    });
  }
};
