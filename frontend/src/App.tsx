import React, { useState , useEffect, useContext} from 'react';

import {toast, Toaster} from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom';
import RedirectPage from './components/RedirectPage';
import { NavContext } from './context/NavigationContext';


export default function App() {

  const {  renderPage } = useContext(NavContext);

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