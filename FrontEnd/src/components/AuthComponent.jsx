// AuthComponent.jsx
import React from 'react';
import { Blocks } from 'lucide-react';

const AuthComponent = ({
  isLogin,
  setIsLogin,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  handleLogin,
  handleRegister,
  loading,
  error,
  success
}) => {
  const handleTabSwitch = (loginMode) => {
    setIsLogin(loginMode);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4'>
      <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20'>
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <Blocks className='w-12 h-12 text-blue-400' />
          </div>
          <h1 className='text-3xl font-bold text-white mb-2'>BlockChain App</h1>
          <p className='text-blue-200'>Secure blockchain management</p>
        </div>

        {/* Tab Toggle */}
        <div className='flex mb-6 bg-white/5 rounded-lg p-1'>
          <button
            type='button'
            onClick={() => handleTabSwitch(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin ? 'bg-blue-500 text-white' : 'text-blue-200 hover:text-white'
            }`}>
            Login
          </button>
          <button
            type='button'
            onClick={() => handleTabSwitch(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin ? 'bg-blue-500 text-white' : 'text-blue-200 hover:text-white'
            }`}>
            Register
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className='space-y-4'>
            <input
              type='email'
              placeholder='Email (demo@example.com)'
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className='w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
              autoComplete='email'
            />
            <input
              type='password'
              placeholder='Password (password123)'
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className='w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
              autoComplete='current-password'
            />
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          // Register Form
          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <input
                type='text'
                placeholder='First Name'
                value={registerForm.firstName}
                onChange={(e) =>
                  setRegisterForm((prev) => ({ ...prev, firstName: e.target.value }))
                }
                className='p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
                autoComplete='given-name'
              />
              <input
                type='text'
                placeholder='Last Name'
                value={registerForm.lastName}
                onChange={(e) =>
                  setRegisterForm((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className='p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
                autoComplete='family-name'
              />
            </div>
            <input
              type='email'
              placeholder='Email'
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className='w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
              autoComplete='email'
            />
            <input
              type='password'
              placeholder='Password (min 8 characters)'
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className='w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400'
              autoComplete='new-password'
            />
            <select
              value={registerForm.role}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, role: e.target.value }))
              }
              className='w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400'>
              <option value='user' className='bg-gray-800'>User</option>
              <option value='miner' className='bg-gray-800'>Miner</option>
              <option value='sales' className='bg-gray-800'>Sales</option>
            </select>
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthComponent;
