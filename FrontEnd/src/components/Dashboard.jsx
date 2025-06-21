import React, { useEffect } from 'react';
import { Wallet, Blocks, Activity } from 'lucide-react';

const Dashboard = ({ blocks, transactions, walletInfo }) => {
  useEffect(() => {
    console.log('blocks loaded', blocks);
  }, [blocks]);

  return (
    <div className='relative'>
      <div className='grid gap-6 md:grid-cols-3'>
        <div className='bg-blue-100 p-4 rounded shadow'>
          <h3 className='flex justify-between text-blue-700'>
            Wallet Balance <Wallet />
          </h3>
          <p className='text-xl font-bold'>{walletInfo.balance} BC</p>
        </div>

        <div className='bg-green-100 p-4 rounded shadow'>
          <h3 className='flex justify-between text-green-700'>
            Total Blocks <Blocks />
          </h3>
          <p className='text-xl font-bold'>{blocks.length}</p>
        </div>

        <div className='bg-purple-100 p-4 rounded shadow'>
          <h3 className='flex justify-between text-purple-700'>
            Transactions <Activity />
          </h3>
          <p className='text-xl font-bold'>{transactions.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
