import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the form
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    imageUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const productsCollectionRef = collection(db, 'products');

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    const data = await getDocs(productsCollectionRef);
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...currentProduct,
      price: Number(currentProduct.price) // Ensure price is a number
    };

    if (isEditing) {
      // Update existing product
      const productDoc = doc(db, 'products', currentProduct.id);
      await updateDoc(productDoc, productData);
    } else {
      // Add new product
      await addDoc(productsCollectionRef, productData);
    }
    
    resetForm();
    fetchProducts(); // Refresh the product list
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const productDoc = doc(db, 'products', id);
      await deleteDoc(productDoc);
      fetchProducts(); // Refresh the list
    }
  };

  const resetForm = () => {
    setCurrentProduct({ name: '', price: '', category: '', description: '', imageUrl: '' });
    setIsEditing(false);
    setFormVisible(false);
  };

  const openNewProductForm = () => {
    resetForm();
    setFormVisible(true);
  };

  if (loading) {
    return <p className="text-center text-xl">Loading dashboard...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={openNewProductForm}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Add New Product
        </button>
      </div>

      {/* Product Form */}
      {formVisible && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            {/* Form Fields: Name, Price, Category, Description, Image URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input name="name" value={currentProduct.name} onChange={handleInputChange} placeholder="Product Name" className="p-2 border rounded" required />
              <input name="price" type="number" value={currentProduct.price} onChange={handleInputChange} placeholder="Price" className="p-2 border rounded" required />
              <input name="category" value={currentProduct.category} onChange={handleInputChange} placeholder="Category" className="p-2 border rounded" required />
              <input name="imageUrl" value={currentProduct.imageUrl} onChange={handleInputChange} placeholder="Image URL" className="p-2 border rounded" required />
            </div>
            <textarea name="description" value={currentProduct.description} onChange={handleInputChange} placeholder="Description" className="w-full p-2 border rounded mb-4" required />
            
            <div className="flex justify-end gap-4">
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">{isEditing ? 'Update Product' : 'Save Product'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Category</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">₹{product.price.toFixed(2)}</td>
                  <td className="p-2">{product.category}</td>
                  <td className="p-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
