import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import our database instance
import ProductCard from '../components/ProductCard';

function ProductListPage() {
  // useState creates a state variable to hold our array of products.
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect runs code after the component first renders.
  // The empty array [] means it will only run once, like "on component load".
  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productsList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList); // Update state with the fetched products
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="text-center text-xl">Loading products...</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;