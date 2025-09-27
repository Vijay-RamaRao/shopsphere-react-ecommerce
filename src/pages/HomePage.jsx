import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (no changes to the fetching logic)
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const productsCollectionRef = collection(db, "products");
        const q = query(productsCollectionRef, limit(4));
        const productSnapshot = await getDocs(q);
        const productsList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedProducts(productsList);
      } catch (error) {
        console.error("Error fetching featured products: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="space-y-16">
      {/* New Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-blue-500 text-white rounded-lg shadow-hero py-24 px-8 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>{" "}
        {/* Softer overlay */}
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 leading-tight">
            Discover Your <span className="text-yellow-300">Next Favorite</span>{" "}
            Item
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90">
            Explore our curated collection of high-quality products,
            meticulously selected for the modern shopper.
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-primary-700 font-bold py-4 px-10 rounded-full text-xl hover:bg-gray-100 transition-transform transform hover:scale-105 shadow-xl"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Featured Products
        </h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
