import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";
import { useSearch } from "../context/SearchContext";

const CATEGORIES = [
  "All",
  "Apparel",
  "Electronics",
  "Stationery",
  "Home Goods",
];

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsCollectionRef = collection(db, "products");
        let queries = [];

        if (selectedCategory !== "All") {
          queries.push(where("category", "==", selectedCategory));
        }

        if (searchTerm) {
          queries.push(where("name", ">=", searchTerm));
          queries.push(where("name", "<=", searchTerm + "\uf8ff"));
        }

        const productsQuery = query(productsCollectionRef, ...queries);

        const productSnapshot = await getDocs(productsQuery);
        const productsList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm]);

  if (loading) {
    return (
      <p className="text-center text-xl text-gray-600 mt-8">
        Loading products...
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-900">
        All Products
      </h2>

      {/* Category Filter Buttons */}
      <div className="flex justify-center gap-3 md:gap-4 mb-12 flex-wrap">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 ${
              selectedCategory === category
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-700 shadow-sm"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;
