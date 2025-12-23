import React, { useState , useEffect, useContext} from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { AdminPage } from './components/AdminPage';
import axios from 'axios'
import {toast, Toaster} from 'react-hot-toast'
import { AuthContext } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom';
import RedirectPage from './components/RedirectPage';


export default function App() {

  const { navigate, setCurrentPage , currentPage , authCheck , userData , token , setToken , setUserData , handleLogout} = useContext(AuthContext);

  const handleUpgrade = (plan: 'pro' | 'business') => {
    if (!userData) return;

    setUserData({
      ...userData,
      subscriptionPlan: plan,
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    });
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'signup':
        return (
          <AuthPage
            mode="signup"
          />
        );
      case 'login':
        return (
          <AuthPage
            mode="login"
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            onUpgrade={handleUpgrade}
          />
        );
      case 'admin':
        return (
          <AdminPage
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        );
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* SHORT URL ROUTE */}
        <Route path="/:shortCode" element={<RedirectPage />} />

        {/*  EVERYTHING ELSE */}
        <Route path="/" element={renderPage()} />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}