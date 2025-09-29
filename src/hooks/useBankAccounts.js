import { useState, useEffect } from 'react';
import { bankAccountService } from '@/services/api/bankAccountService';
import { toast } from 'react-toastify';

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bankAccountService.getAll();
      setAccounts(data);
    } catch (err) {
      console.info(`apper_info: An error was received in this function: fetchAccounts. The error is: ${err.message}`);
      setError(err.message);
      toast.error('Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (accountData) => {
    try {
      setError(null);
      const newAccount = await bankAccountService.create(accountData);
      setAccounts(prev => [...prev, newAccount]);
      toast.success('Bank account created successfully');
      return newAccount;
    } catch (err) {
      console.info(`apper_info: An error was received in this function: createAccount. The error is: ${err.message}`);
      setError(err.message);
      toast.error('Failed to create bank account');
      throw err;
    }
  };

  const updateAccount = async (id, accountData) => {
    try {
      setError(null);
      const updatedAccount = await bankAccountService.update(id, accountData);
      setAccounts(prev => prev.map(account => 
        account.Id === parseInt(id) ? updatedAccount : account
      ));
      toast.success('Bank account updated successfully');
      return updatedAccount;
    } catch (err) {
      console.info(`apper_info: An error was received in this function: updateAccount. The error is: ${err.message}`);
      setError(err.message);
      toast.error('Failed to update bank account');
      throw err;
    }
  };

  const deleteAccount = async (id) => {
    try {
      setError(null);
      await bankAccountService.delete(id);
      setAccounts(prev => prev.filter(account => account.Id !== parseInt(id)));
      toast.success('Bank account deleted successfully');
    } catch (err) {
      console.info(`apper_info: An error was received in this function: deleteAccount. The error is: ${err.message}`);
      setError(err.message);
      toast.error('Failed to delete bank account');
      throw err;
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount
  };
};