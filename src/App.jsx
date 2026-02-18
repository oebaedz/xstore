import { Routes, Route, Navigate } from "react-router-dom";
import ProductList from "./components/ProductList";
import ReviewOrder from "./components/ReviewOrder";
import OrdererInfo from "./components/OrdererInfo";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useRef, useState } from "react";
import { StoreContext } from "./StoreContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import DashboardHome from "./pages/DashboardHome";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/layout/AdminLayout";
import RegLayout from "./components/layout/RegLayout";
import ProductSale from "./pages/ProductSale";
import ProductFormPage from "./pages/ProductFormPage";
import { ToastProvider } from "./context/ToastContext";
import NewHome from "./pages/NewHome";
import Nyoba from "./components/newcomps/Nyoba";

function App() {
  const itemsFromLocalStorage = JSON.parse(localStorage.getItem('cart')) || []

  const [items, setItems] = useState(itemsFromLocalStorage);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (data) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === data.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === data.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevItems, { ...data, qty: 1 }];
      }
    });
  }

  const value = {
    items,
    setItems,
    addToCart,
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <ThemeProvider>
      <ToastProvider>
      <div>
        <StoreContext.Provider value={value}>
          <Routes>
            <Route element={<RegLayout />}>
              <Route path="/" element={<ProductList />} />
              <Route path="/review" element={<ReviewOrder />} />
              <Route path="/checkout" element={<OrdererInfo />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/v2" element={<Nyoba />} />

            <Route element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/products" element={<ProductSale />} />
                <Route path="/products/add" element={<ProductFormPage />} />
                <Route path="/products/edit/:id" element={<ProductFormPage />} />
                <Route path="/orders" element={<Dashboard />} />
            </Route>
          </Routes>
        </StoreContext.Provider>
      </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
