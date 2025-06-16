import React, { useState, useEffect } from 'react';
import AuthComponent from './components/Auth/AuthComponent';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Navigation/Sidebar';
import { fetchWalletInfo, fetchDashboardData } from './api/api';

const App = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const data = await fetchWalletInfo();
      if (data) {
        setUser({ email: 'user@example.com' });
        setWalletInfo(data);
        await fetchDashboard();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
    setLoading(false);
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { blocks, transactions, walletInfo } = await fetchDashboardData();
      setBlocks(blocks);
      setTransactions(transactions);
      setWalletInfo(walletInfo);
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <AuthComponent
        setUser={setUser}
        loadUserData={loadUserData}
        loading={loading}
        setLoading={setLoading}
      />
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar setActiveTab={setActiveTab} handleLogout={() => {
        localStorage.removeItem('token');
        setUser(null);
        setActiveTab('dashboard');
      }} />
      <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <Dashboard
            blocks={blocks}
            transactions={transactions}
            walletInfo={walletInfo}
            setActiveTab={setActiveTab}
          />
        )}
        {/* You can render other tabs here */}
      </main>
    </div>
  );
};

export default App;
