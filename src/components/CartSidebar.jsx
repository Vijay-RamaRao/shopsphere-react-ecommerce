import React from 'react';
import { useCart } from '../context/CartContext';

const TrashIcon = () => ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>);

function CartSidebar() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity } = useCart();
  
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsCartOpen(false)}>
      {/* Panel */}
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the panel from closing it
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-2xl">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            <ul>
              {cartItems.map(item => (
                <li key={item.id} className="flex items-center py-4 border-b">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="border px-2 py-1 rounded">-</button>
                      <span className="px-3">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="border px-2 py-1 rounded">+</button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 ml-4">
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartSidebar;