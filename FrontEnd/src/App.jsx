// App.jsx (Updated with debug and tab fix)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LogOut,
  Blocks,
  Send,
  Wallet,
  Pickaxe,
  Activity,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import AuthComponent from './components/AuthComponent';
import Dashboard from './components/Dashboard';
import TransactionComponent from './components/TransactionComponent';
import BlockchainComponent from './components/BlockchainComponent';

const API_BASE = '/api';
axios.defaults.baseURL = API_BASE;

const Spinner = () => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
    <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid'></div>
  </div>
);

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [walletInfo, setWalletInfo] = useState({ balance: 0, address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [transactionForm, setTransactionForm] = useState({
    recipient: '',
    amount: '',
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 10000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        console.log('🔄 Fetching dashboard data...');
        const [blockRes, txRes, walletRes] = await Promise.all([
          axios.get('/blocks'),
          axios.get('/wallet/transactions'),
          axios.get('/wallet/info'),
        ]);
        setBlocks(blockRes.data.data);
        setTransactions(txRes.data.data);
        setWalletInfo(walletRes.data.data);
        setActiveTab('dashboard');
      } catch (err) {
        console.error('❌ Fetch error:', err);
        showError('Failed to load dashboard data');
      }
    };

    if (user && token) {
      console.log('✅ User & token set, triggering fetchInitialData()');
      fetchInitialData();
    }
  }, [user, token]);

  const showError = (message) => setError(message);
  const showSuccess = (message) => setSuccess(message);

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password)
      return showError('Please fill in all fields');
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', loginForm);
      const { token, user } = res.data.data;
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLoginForm({ email: '', password: '' });
      showSuccess('Login successful!');
      setActiveTab('dashboard');
      console.log('🚀 Login successful, user:', user);
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed');
      console.error('❌ Login error:', err);
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    const { firstName, lastName, email, password, role } = registerForm;
    if (!firstName || !lastName || !email || !password)
      return showError('Please fill in all fields');
    if (password.length < 8)
      return showError('Password must be at least 8 characters');
    if (!/\S+@\S+\.\S+/.test(email)) return showError('Invalid email');
    setLoading(true);
    try {
      await axios.post('/auth/register', registerForm);
      showSuccess('Registration successful! You can now login.');
      setRegisterForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user',
      });
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleTransaction = async () => {
    if (!transactionForm.recipient || !transactionForm.amount)
      return showError('Please fill in all fields');
    if (parseFloat(transactionForm.amount) <= 0)
      return showError('Amount must be greater than 0');
    if (parseFloat(transactionForm.amount) > walletInfo.balance)
      return showError('Insufficient balance');
    setLoading(true);
    try {
      const res = await axios.post('/transactions', transactionForm);
      const newTransaction = res.data.data;
      setTransactions((prev) => [newTransaction, ...prev]);
      setTransactionForm({ recipient: '', amount: '' });
      showSuccess('Transaction created successfully!');
    } catch (err) {
      showError(err.response?.data?.message || 'Transaction failed');
    }
    setLoading(false);
  };

  const mineBlock = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/mine');
      const newBlock = res.data.data;
      setBlocks((prev) => [...prev, newBlock]);
      setWalletInfo((prev) => ({ ...prev, balance: prev.balance + 10 }));
      showSuccess('Block mined successfully! +1 BC reward');
    } catch (err) {
      showError(err.response?.data?.message || 'Mining failed');
    }
    setLoading(false);
  };

  const mineTransactions = async () => {
    if (transactions.length === 0) return showError('No transactions to mine');
    setLoading(true);
    try {
      const res = await axios.get('/transactions/mine');
      const minedBlock = res.data.data;
      setBlocks((prev) => [...prev, minedBlock]);
      setWalletInfo((prev) => ({ ...prev, balance: prev.balance + 5 }));
      showSuccess('Transactions mined! +5 BC reward');
    } catch (err) {
      showError(err.response?.data?.message || 'Transaction mining failed');
    }
    setLoading(false);
  };

  const NotificationBar = () => {
    if (!error && !success) return null;
    return (
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          error ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
        {error ? (
          <AlertCircle className='w-5 h-5' />
        ) : (
          <CheckCircle className='w-5 h-5' />
        )}
        <span>{error || success}</span>
      </div>
    );
  };

  if (!user) {
    return (
      <>
        {loading && <Spinner />}
        <AuthComponent
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          loading={loading}
          error={error}
          success={success}
        />
        <NotificationBar />
      </>
    );
  }

  return (
    <>
      {loading && <Spinner />}
      <div className='min-h-screen bg-gray-100'>
        <header className='bg-white shadow p-4 flex justify-between items-center'>
          <h1 className='text-xl font-bold text-gray-800'>Blockchain App</h1>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-700'>{user.email}</span>
            <button
              onClick={() => {
                setUser(null);
                setToken(null);
                delete axios.defaults.headers.common['Authorization'];
              }}
              className='text-red-600 hover:text-red-800 flex items-center gap-1'>
              <LogOut className='w-4 h-4' /> Logout
            </button>
          </div>
        </header>

        <nav className='flex gap-4 p-4 bg-gray-50 border-b'>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={
              activeTab === 'dashboard'
                ? 'text-blue-600 font-bold'
                : 'text-gray-600'
            }>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={
              activeTab === 'transactions'
                ? 'text-blue-600 font-bold'
                : 'text-gray-600'
            }>
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('blockchain')}
            className={
              activeTab === 'blockchain'
                ? 'text-blue-600 font-bold'
                : 'text-gray-600'
            }>
            Blockchain
          </button>
        </nav>

        <main className='p-4'>
          {activeTab === 'dashboard' && (
            <Dashboard
              blocks={blocks}
              transactions={transactions}
              walletInfo={walletInfo}
            />
          )}
          {activeTab === 'transactions' && (
            <TransactionComponent
              transactionForm={transactionForm}
              setTransactionForm={setTransactionForm}
              walletInfo={walletInfo}
              handleTransaction={handleTransaction}
              mineTransactions={mineTransactions}
              transactions={transactions}
              loading={loading}
            />
          )}
          {activeTab === 'blockchain' && (
            <BlockchainComponent
              blocks={blocks}
              mineBlock={mineBlock}
              loading={loading}
            />
          )}
        </main>
        <NotificationBar />
      </div>
    </>
  );
};

export default App;
