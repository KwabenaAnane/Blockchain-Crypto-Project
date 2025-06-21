
import React from 'react';

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
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded shadow'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {isLogin ? (
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className='space-y-4'>
            <input
              type='email'
              placeholder='Email'
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              className='w-full p-2 border rounded'
            />
            <input
              type='password'
              placeholder='Password'
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              className='w-full p-2 border rounded'
            />
            <button type='submit' disabled={loading} className='w-full bg-blue-500 text-white p-2 rounded'>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className='space-y-4'>
            <input
              type='text'
              placeholder='First Name'
              value={registerForm.firstName}
              onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
              className='w-full p-2 border rounded'
            />
            <input
              type='text'
              placeholder='Last Name'
              value={registerForm.lastName}
              onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
              className='w-full p-2 border rounded'
            />
            <input
              type='email'
              placeholder='Email'
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              className='w-full p-2 border rounded'
            />
            <input
              type='password'
              placeholder='Password'
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              className='w-full p-2 border rounded'
            />
            <button type='submit' disabled={loading} className='w-full bg-green-500 text-white p-2 rounded'>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        <div className='text-center mt-4'>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className='text-blue-600 hover:underline'>
            {isLogin ? 'Create an account' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
