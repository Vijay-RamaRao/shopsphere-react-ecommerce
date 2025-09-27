import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => ( <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48"> <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 9.122C34.553 5.166 29.693 3 24 3C12.43 3 3 12.43 3 24s9.43 21 21 21s21-9.43 21-21c0-1.341-.138-2.65-.389-3.917z"></path> <path fill="#FF3D00" d="M6.306 14.691c-1.324 2.493-2.095 5.37-2.095 8.309c0 2.939.771 5.816 2.095 8.309L12.02 24l-5.714-9.309z"></path> <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238c-2.008 1.32-4.402 2.108-7.219 2.108c-5.22 0-9.643-3.336-11.284-7.932l-6.305 4.902C7.925 39.366 15.245 44 24 44z"></path> <path fill="#1976D2" d="M43.611 20.083L43.594 20H24v8h11.303a12.024 12.024 0 0 1-5.22 7.932l6.305 4.902C41.075 35.866 44 30.166 44 24c0-1.341-.138-2.65-.389-3.917z"></path> </svg>);


function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', or 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // For success/error messages
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/'); // Redirect to homepage if logged in
    }
  }, [currentUser, navigate]);

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (mode === 'login') {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } catch (err) { setError('Failed to sign in. Check email/password.'); }
    } else if (mode === 'signup') {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/');
      } catch (err) { setError('Failed to sign up. This email may already be in use.'); }
    } else if (mode === 'reset') {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox & spam.');
        } catch (err) { setError('Failed to send reset email. Check the address.'); }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) { setError('Failed to sign in with Google.'); }
  };
  
  const getTitle = () => {
    if (mode === 'login') return 'Login';
    if (mode === 'signup') return 'Create Account';
    if (mode === 'reset') return 'Reset Password';
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">{getTitle()}</h2>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</p>}
        {message && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{message}</p>}
        
        <form onSubmit={handleAuthAction}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input 
              type="email" id="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required 
            />
          </div>
          
          {mode !== 'reset' && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
              <input 
                type="password" id="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {mode === 'signup' ? 'Sign Up' : mode === 'reset' ? 'Send Reset Email' : 'Login'}
          </button>
        </form>

        {mode !== 'reset' && (
          <>
            <div className="text-center my-4 text-gray-500">OR</div>
            <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <GoogleIcon />
              Sign In with Google
            </button>
          </>
        )}

        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => { setMode('signup'); setError(''); }} className="text-blue-600 hover:underline">Sign Up</button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="text-blue-600 hover:underline">Login</button>
            </p>
          )}
          <p className="text-sm text-gray-600 mt-2">
            <button onClick={() => { setMode('reset'); setError(''); }} className="text-blue-600 hover:underline">Forgot Password?</button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
