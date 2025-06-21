import React from 'react';

const TransactionComponent = ({
  transactionForm,
  setTransactionForm,
  walletInfo,
  handleTransaction,
  mineTransactions,
  transactions,
  loading,
}) => {
  return (
    <div className='space-y-6'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleTransaction();
        }}
        className='bg-white p-4 rounded shadow'>
        <h3 className='text-lg font-bold mb-4'>Send Transaction</h3>
        <div className='grid gap-4 md:grid-cols-3'>
          <input
            type='text'
            placeholder='Recipient Address'
            value={transactionForm.recipient}
            onChange={(e) =>
              setTransactionForm({
                ...transactionForm,
                recipient: e.target.value,
              })
            }
            className='p-2 border rounded w-full'
          />
          <input
            type='number'
            placeholder='Amount'
            value={transactionForm.amount}
            onChange={(e) =>
              setTransactionForm({ ...transactionForm, amount: e.target.value })
            }
            className='p-2 border rounded w-full'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded w-full'>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <p className='text-sm text-gray-500 mt-2'>
          Available Balance: {walletInfo.balance} BTC
        </p>
      </form>

      <div className='bg-white p-4 rounded shadow'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-bold'>Pending Transactions</h3>
          <button
            onClick={mineTransactions}
            className='bg-green-500 text-white px-4 py-2 rounded'>
            {loading ? 'Mining...' : 'Create Transactions'}
          </button>
        </div>
        <ul className='space-y-2'>
          {transactions.map((tx, idx) => (
            <li key={idx} className='border-b pb-2 text-sm'>
              {tx.input?.amount} BTC from {tx.input?.address?.substring(0, 12)}
              ...
            </li>
          ))}
          {transactions.length === 0 && (
            <li className='text-gray-500'>No transactions</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TransactionComponent;
