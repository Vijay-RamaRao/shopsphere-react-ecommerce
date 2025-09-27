import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, collection, onSnapshot, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { currentUser } = useAuth();

  // Effect to listen for real-time cart updates from Firestore
  useEffect(() => {
    if (currentUser) {
      // Path to the user's cart subcollection
      const cartCollectionRef = collection(db, 'users', currentUser.uid, 'cart');
      
      // onSnapshot creates a real-time listener
      const unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCartItems(items);
      });

      // Cleanup the listener when the user logs out or component unmounts
      return () => unsubscribe();
    } else {
      // If user logs out, clear the cart
      setCartItems([]);
    }
  }, [currentUser]);

  const addToCart = async (product) => {
    if (!currentUser) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const cartDocRef = doc(db, 'users', currentUser.uid, 'cart', product.id);
    const docSnap = await getDoc(cartDocRef);

    if (docSnap.exists()) {
      // If item is already in cart, increase quantity
      await setDoc(cartDocRef, { quantity: docSnap.data().quantity + 1 }, { merge: true });
    } else {
      // If item is not in cart, add it with quantity 1
      await setDoc(cartDocRef, { ...product, quantity: 1 });
    }
  };

  const removeFromCart = async (productId) => {
    if (!currentUser) return;
    const cartDocRef = doc(db, 'users', currentUser.uid, 'cart', productId);
    await deleteDoc(cartDocRef);
  };
  
  const updateQuantity = async (productId, quantity) => {
    if (!currentUser) return;
    const cartDocRef = doc(db, 'users', currentUser.uid, 'cart', productId);
    if (quantity > 0) {
      await setDoc(cartDocRef, { quantity }, { merge: true });
    } else {
      // If quantity is 0 or less, remove the item
      await deleteDoc(cartDocRef);
    }
  };

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}