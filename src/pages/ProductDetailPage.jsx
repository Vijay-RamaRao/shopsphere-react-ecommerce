import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const productRef = doc(db, "products", productId);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Product not found.");
          toast.error("Product not found!");
          navigate("/products"); // Redirect to products page if not found
        }
      } catch (err) {
        console.error("Error fetching product details: ", err);
        setError("Failed to load product details.");
        toast.error("Failed to load product details.");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  if (loading) {
    return (
      <p className="text-center text-xl text-gray-600 mt-8">
        Loading product details...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-xl text-red-500 mt-8">{error}</p>;
  }

  if (!product) return null; // Should not happen with the redirect above, but as a safeguard

  return (
    <div className="bg-white rounded-xl shadow-lg-light p-8 md:p-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
      <div className="md:w-1/2 flex justify-center items-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full max-h-[400px] object-contain rounded-lg shadow-md"
        />
      </div>
      <div className="md:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>
          <p className="text-primary-600 text-2xl font-bold mb-4">
            ${product.price.toFixed(2)}
          </p>
          <div className="bg-primary-50 text-primary-700 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
            {product.category}
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {product.description}
          </p>
        </div>
        <button
          onClick={() => addToCart(product)}
          className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors text-xl font-semibold shadow-md-light"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
