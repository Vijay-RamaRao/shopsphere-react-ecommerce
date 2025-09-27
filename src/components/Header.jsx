import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useCart } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const CartIcon = () => ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>);

function Header() {
  const { currentUser } = useAuth();
  const { setIsCartOpen, cartItems } = useCart();
  const navigate = useNavigate();
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">ShopSphere</Link>
        <div>
          {currentUser ? (
            // If user is logged in, show their email and a Logout button
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{currentUser.email}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            // If no user is logged in, show a Login button
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Login / Sign-up
            </Link>
          )}
          <button onClick={() => setIsCartOpen(true)} className="relative">
            <CartIcon />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;