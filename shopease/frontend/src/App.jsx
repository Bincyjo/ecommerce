import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/routes/ProtectedRoute';
import { AdminRoute } from './components/routes/AdminRoute';

// Layout & Core Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { StorefrontPage } from './pages/StorefrontPage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';

// Customer Layout wrapper with Navbar and Footer
const CustomerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public / Customer Storefront Routes */}
            <Route
              path="/"
              element={
                <CustomerLayout>
                  <StorefrontPage />
                </CustomerLayout>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <CustomerLayout>
                    <CustomerOrdersPage />
                  </CustomerLayout>
                </ProtectedRoute>
              }
            />

            {/* Authentication Routes */}
            <Route
              path="/login"
              element={
                <CustomerLayout>
                  <LoginPage />
                </CustomerLayout>
              }
            />

            <Route
              path="/register"
              element={
                <CustomerLayout>
                  <RegisterPage />
                </CustomerLayout>
              }
            />

            {/* Admin Routes with nested AdminLayout */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Route>

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <CustomerLayout>
                  <NotFoundPage />
                </CustomerLayout>
              }
            />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
