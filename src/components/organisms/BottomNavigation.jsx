import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/' },
    { id: 'expenses', label: 'Expenses', icon: 'Receipt', path: '/expenses' },
    { id: 'budget', label: 'Budget', icon: 'PieChart', path: '/budget' },
    { id: 'goals', label: 'Goals', icon: 'Target', path: '/goals' },
    { id: 'bank-accounts', label: 'Accounts', icon: 'CreditCard', path: '/bank-accounts' },
    { id: 'profile', label: 'Profile', icon: 'User', path: '/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-primary-600 bg-primary-50" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              <ApperIcon 
                name={item.icon} 
                className={cn(
                  "w-6 h-6 mb-1",
                  isActive && "text-primary-600"
                )} 
              />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;