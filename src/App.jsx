import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import ProductListPage from "./pages/ProductListPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartSidebar from './components/CartSidebar';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="bg-gray-100 min-h-screen font-sans flex flex-col">
            <Header />
            <CartSidebar />
            <main className="container mx-auto px-4 py-8 flex-grow">
              <Routes>
                {/* Public Routes - Anyone can see these */}
                <Route path="/" element={<ProductListPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/product/:productId"
                  element={<ProductDetailPage />}
                />

                {/* Protected Admin Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
