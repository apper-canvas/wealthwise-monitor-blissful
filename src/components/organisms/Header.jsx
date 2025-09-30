import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { AuthContext } from '@/App';
import { toast } from 'react-toastify';

const Header = ({ onAddExpense, userName }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">WealthWise</h1>
<p className="text-primary-100 mt-1">{userName || user?.name_c || user?.firstName || "Welcome back"}</p>
          </div>
<div className="flex items-center space-x-3">
            {onAddExpense && (
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={onAddExpense}
              >
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                Add Expense
              </Button>
            )}
            {isAuthenticated && (
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <ApperIcon name="LogOut" className="w-5 h-5 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;