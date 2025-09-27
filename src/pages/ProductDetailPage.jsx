import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // Create a reference to the specific document
        const productDocRef = doc(db, "products", productId);
        const docSnap = await getDoc(productDocRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
          // You could redirect to a 404 page here
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]); // Re-run the effect if the productId changes

  if (loading) {
    return <p className="text-center text-xl mt-10">Loading product...</p>;
  }

  if (!product) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl">Product not found.</h1>
        <Link
          to="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to all products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to all products
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <h1 className="text-4xl font-bold my-4">{product.name}</h1>
          <p className="text-3xl text-gray-800 font-semibold mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
