import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';

function CheckoutPage() {
  const { cartItems, setIsCartOpen } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1 for Shipping, 2 for Payment
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', city: '', zipCode: '' });
  // We'll just collect payment info, but not use it.
  const [paymentInfo, setPaymentInfo] = useState({ cardNumber: '', expiry: '', cvc: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing) {
      navigate('/');
    }
    setIsCartOpen(false);
  }, [cartItems, navigate, isProcessing, setIsCartOpen]);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'shipping') {
      setShippingInfo({ ...shippingInfo, [name]: value });
    } else {
      setPaymentInfo({ ...paymentInfo, [name]: value });
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please log in to place an order.");
      return;
    }
    setIsProcessing(true);

    try {
      const orderData = {
        userId: currentUser.uid,
        email: currentUser.email,
        shippingInfo,
        items: cartItems,
        subtotal,
        status: 'pending',
        createdAt: serverTimestamp(),
      };
      const ordersCollectionRef = collection(db, 'users', currentUser.uid, 'orders');
      await addDoc(ordersCollectionRef, orderData);

      const cartCollectionRef = collection(db, 'users', currentUser.uid, 'cart');
      const batch = writeBatch(db);
      cartItems.forEach(item => {
        const docRef = doc(cartCollectionRef, item.id);
        batch.delete(docRef);
      });
      await batch.commit();

      toast.success("Order placed successfully!");
      navigate('/');

    } catch (error) {
      console.error("Error placing order: ", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Forms Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <form onSubmit={() => setStep(2)}>
              <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                <input type="text" name="name" id="name" onChange={(e) => handleInputChange(e, 'shipping')} value={shippingInfo.name} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              {/* ... other shipping inputs ... */}
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
                <input type="text" name="address" id="address" onChange={(e) => handleInputChange(e, 'shipping')} value={shippingInfo.address} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block text-gray-700 mb-2">City</label>
                <input type="text" name="city" id="city" onChange={(e) => handleInputChange(e, 'shipping')} value={shippingInfo.city} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div className="mb-4">
                <label htmlFor="zipCode" className="block text-gray-700 mb-2">ZIP Code</label>
                <input type="text" name="zipCode" id="zipCode" onChange={(e) => handleInputChange(e, 'shipping')} value={shippingInfo.zipCode} className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                Continue to Payment
              </button>
            </form>
          )}

          {/* Step 2: Payment Details */}
          {step === 2 && (
            <form onSubmit={handlePlaceOrder}>
              <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
              <p className="text-sm text-gray-500 mb-4">This is a simulation. Do not enter real credit card details.</p>
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-gray-700 mb-2">Card Number</label>
                <input type="text" name="cardNumber" id="cardNumber" onChange={(e) => handleInputChange(e, 'payment')} placeholder="1234 5678 9101 1121" className="w-full px-3 py-2 border rounded-lg" required />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="expiry" className="block text-gray-700 mb-2">Expiry</label>
                  <input type="text" name="expiry" id="expiry" onChange={(e) => handleInputChange(e, 'payment')} placeholder="MM/YY" className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                  <label htmlFor="cvc" className="block text-gray-700 mb-2">CVC</label>
                  <input type="text" name="cvc" id="cvc" onChange={(e) => handleInputChange(e, 'payment')} placeholder="123" className="w-full px-3 py-2 border rounded-lg" required />
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button type="button" onClick={() => setStep(1)} className="text-blue-600 hover:underline">
                  &larr; Back to Shipping
                </button>
                <button 
                  type="submit" 
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${subtotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order Summary (No changes here) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t my-4"></div>
          <div className="flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;