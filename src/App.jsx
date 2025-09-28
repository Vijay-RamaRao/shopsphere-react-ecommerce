import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import ProductListPage from "./pages/ProductListPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartSidebar from "./components/CartSidebar";
import CheckoutPage from "./pages/CheckoutPage";
import AdminRoute from "./components/AdminRoute";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Router basename={import.meta.env.BASE_URL}>
            <Toaster position="bottom-center" />
            <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
              <Header />
              <CartSidebar />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />{" "}
                  {/* 2. Set HomePage as the root */}
                  <Route path="/products" element={<ProductListPage />} />{" "}
                  {/* 3. Add a new route for all products */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route
                    path="/product/:productId"
                    element={<ProductDetailPage />}
                  />
                  {/* Protected Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
