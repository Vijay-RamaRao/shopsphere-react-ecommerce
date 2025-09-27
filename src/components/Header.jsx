import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { ADMIN_UID } from "../config";

const CartIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    ></path>
  </svg>
);

function useDebounced(value, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function Header() {
  const { currentUser } = useAuth();
  const { setIsCartOpen, cartItems } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [q, setQ] = useState(searchTerm ?? "");
  const debouncedQ = useDebounced(q, 250);

  useEffect(() => {
    setSearchTerm(debouncedQ);
  }, [debouncedQ, setSearchTerm]);

  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Ensure we are on the products page when searching
    if (window.location.pathname !== "/products") {
      navigate("/products");
    }
  };

  const isAdmin = currentUser && currentUser.uid === ADMIN_UID;

  return (
    <header className="bg-white shadow-md sticky top-0 z-30 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-extrabold text-primary-600 hover:text-primary-700 transition-colors"
        >
          ShopSphere
        </Link>

        <nav className="hidden md:flex gap-6 items-center flex-grow justify-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
          >
            All Products
          </Link>
        </nav>

        {/* Search Bar (form prevents default; no reloads) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:block w-1/4 max-w-sm ml-auto mr-4"
        >
          <input
            type="search"
            placeholder="Search for products…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </form>

        {/* Right side icons and dropdown */}
        <div className="flex items-center gap-4 ml-auto">
          {" "}
          {/* Adjusted ml-auto */}
          {currentUser ? (
            <div className="relative">
              {/* Dropdown Toggle */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-primary-600 transition-colors py-2 px-3 rounded-full hover:bg-gray-50"
              >
                <span className="font-medium">{currentUser.email}</span>
                <svg
                  className={`w-4 h-4 ml-1 transform transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg-light py-1 z-40 border border-gray-100">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    My Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary-600 text-white px-5 py-2 rounded-full hover:bg-primary-700 transition-colors font-medium shadow-md-light"
            >
              Login / Sign Up
            </Link>
          )}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            <CartIcon />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
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
