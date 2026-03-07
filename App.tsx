
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './src/components/layout/Header';
import Footer from './src/components/layout/Footer';
import Home from './src/pages/Home/Home';
import Shop from './src/pages/Shop/Shop';
import ProductDetail from './src/pages/Product/ProductDetail';
import Dashboard from './src/pages/admin/Dashboard';
import AdminProducts from './src/pages/admin/Products';
import AdminOrders from './src/pages/admin/Orders';
import AdminUsers from './src/pages/admin/Users';
import AdminBrands from './src/pages/admin/Brands';
import AdminCategories from './src/pages/admin/Categories';
import AdminPromotions from './src/pages/admin/Promotions';
import Login from './src/pages/auth/Login';
import Register from './src/pages/auth/Register';
import BuildPC from './src/pages/BuildPC';
import ScrollToTop from './src/components/ScrollToTop';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { CompareProvider } from './src/context/CompareContext';
import CompareBar from './src/components/ui/CompareBar';
import CompareSearchModal from './src/components/ui/CompareSearchModal';
import Cart from './src/pages/Cart/Cart';
import Checkout from './src/pages/Cart/Checkout';
import Compare from './src/pages/Compare/Compare';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CompareProvider>
        <Router>
          <CartProvider>
            <ScrollToTop />
            <CompareBar />
            <CompareSearchModal />
            <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Admin routes */}
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/brands" element={<AdminBrands />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/promotions" element={<AdminPromotions />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Public routes with Header/Footer layout */}
              <Route path="*" element={
                <>
                  <HeaderWithCart />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/build-pc" element={<BuildPC />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/compare" element={<Compare />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </CartProvider>
      </Router>
    </CompareProvider>
  </AuthProvider>
  );
};

// Helper component to pass cart count from context to Header
const HeaderWithCart: React.FC = () => {
  const { totalItems } = useCart();
  return <Header cartCount={totalItems} />;
};

export default App;
