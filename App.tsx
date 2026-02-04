
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LessonPlanner from './pages/LessonPlanner';
import Subscription from './pages/Subscription';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import TrainingManual from './pages/TrainingManual';
import { StorageService } from './services/storageService';
import { User, CartItem, Product } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Check for existing session and sync with DB for latest permissions
    const storedUser = StorageService.getUser();
    if (storedUser) {
      const allUsers = StorageService.getAllUsers();
      const freshUser = allUsers.find(u => u.id === storedUser.id);
      
      if (freshUser) {
        setUser(freshUser);
        StorageService.setUser(freshUser);
      } else {
        setUser(storedUser);
      }
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
            return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <Layout user={user} setUser={setUser} cartCount={cart.reduce((a, b) => a + b.quantity, 0)}>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} clearCart={clearCart} />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/training-manual" element={<TrainingManual />} />
          
          {/* Protected Routes */}
          <Route 
            path="/lesson-planner" 
            element={<LessonPlanner user={user} />} 
          />
          <Route 
            path="/subscription" 
            element={user ? <Subscription user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user ? <Admin user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
