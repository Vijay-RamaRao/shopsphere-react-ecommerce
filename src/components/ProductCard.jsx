import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {

  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
      <Link to={`/product/${product.id}`} className="block">
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;