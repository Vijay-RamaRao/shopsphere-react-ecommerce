import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const ordersCollectionRef = collection(db, 'users', currentUser.uid, 'orders');
      const q = query(ordersCollectionRef, orderBy('createdAt', 'desc')); // Get newest orders first

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to a readable date
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString()
        }));
        setOrders(userOrders);
        setLoading(false);
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  }, [currentUser]);

  if (loading) {
    return <p className="text-center text-xl">Loading profile...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-gray-600 mb-8">Welcome, {currentUser.email}!</p>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet. <Link to="/" className="text-blue-600 hover:underline">Start shopping!</Link></p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">Order ID: <span className="font-normal text-gray-600">{order.id}</span></p>
                    <p className="font-semibold">Date: <span className="font-normal text-gray-600">{order.createdAt}</span></p>
                  </div>
                  <p className="font-bold text-lg">₹{order.subtotal.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Items:</h4>
                  <ul className="space-y-2">
                    {order.items.map(item => (
                      <li key={item.id} className="flex items-center text-sm">
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded mr-4"/>
                        <span>{item.name} (Qty: {item.quantity})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;