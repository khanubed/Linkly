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

  const {  currentPage , userData , setUserData } = useContext(AuthContext);

  // const handleUpgrade = (plan: 'pro' | 'business') => {
  //   if (!userData) return;

  //     setUserData(prev =>
  //   prev ? { ...prev, subscriptionPlan: plan } : prev
  // );

  // };


  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage  />;
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
            // onUpgrade={handleUpgrade}
          />
        );
      case 'admin':
        return (
          <AdminPage
          />
        );
      default:
        return <LandingPage  />;
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