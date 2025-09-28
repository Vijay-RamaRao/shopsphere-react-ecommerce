import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const TrashIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    ></path>
  </svg>
);

function CartSidebar() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!isCartOpen) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-40"
      onClick={() => setIsCartOpen(false)}
    >
      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out transform translate-x-0"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the panel from closing it
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-500 hover:text-gray-800 text-3xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 mt-8">
              Your cart is currently empty.
            </p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4 shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-primary-600 font-medium">
                      ₹{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="border border-gray-300 px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 text-gray-800 font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="border border-gray-300 px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-4 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between font-bold text-xl text-gray-900 mb-5">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="block w-full">
            <button
              onClick={() => setIsCartOpen(false)} // Close cart when proceeding to checkout
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg shadow-md-light disabled:bg-gray-400"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartSidebar;
