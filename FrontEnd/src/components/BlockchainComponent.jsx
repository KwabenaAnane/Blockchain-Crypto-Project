import React from 'react';
import { Pickaxe } from 'lucide-react';

const BlockchainComponent = ({ blocks, mineBlock, loading }) => {
  return (
    <div className='space-y-6 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-bold'>Blockchain</h3>
        <button
          onClick={mineBlock}
          className='bg-orange-500 text-white px-4 py-2 rounded'>
          {loading ? 'Mining...' : <><Pickaxe className='inline w-4 h-4 mr-1' /> Mine Block</>}
        </button>
      </div>
      <div className='space-y-4'>
        {blocks.map((block, index) => (
          <div key={index} className='border p-4 rounded shadow-sm bg-white'>
            <h4 className='font-bold text-blue-600 mb-2'>Block #{index + 1}</h4>
            <p className='text-xs font-mono'>Hash: {block.hash}</p>
            <p className='text-xs font-mono'>Prev: {block.lastHash}</p>
            <p className='text-sm'>Nonce: {block.nonce}</p>
            <p className='text-sm'>Difficulty: {block.difficulty}</p>
            <p className='text-sm'>Tx Count: {block.data?.length || 0}</p>
            <p className='text-sm'>Time: {new Date(block.timestamp).toLocaleString()}</p>
          </div>
        ))}
        {blocks.length === 0 && <p className='text-gray-500'>No blocks yet.</p>}
      </div>
    </div>
  );
};

export default BlockchainComponent;
