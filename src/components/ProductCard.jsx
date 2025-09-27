// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden group transition-all duration-300 hover:shadow-lg-light transform hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {product.category}
          </div>
        </div>
        <div className="p-5">
          <h3
            className="text-lg font-semibold text-gray-900 truncate mb-1"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
      <div className="p-5 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
