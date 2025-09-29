import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import BottomNavigation from '@/components/organisms/BottomNavigation';
import Dashboard from '@/components/pages/Dashboard';
import Expenses from '@/components/pages/Expenses';
import Budget from '@/components/pages/Budget';
import Goals from '@/components/pages/Goals';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
        
        <BottomNavigation />
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;