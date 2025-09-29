import React, { useState } from 'react';
import Header from '@/components/organisms/Header';
import BankAccountList from '@/components/organisms/BankAccountList';
import BankAccountForm from '@/components/organisms/BankAccountForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { useBankAccounts } from '@/hooks/useBankAccounts';

const BankAccounts = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount
  } = useBankAccounts();

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowForm(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleSaveAccount = async (accountData) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.Id, accountData);
      } else {
        await createAccount(accountData);
      }
      setShowForm(false);
      setEditingAccount(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleDeleteAccount = async (id) => {
    if (confirm('Are you sure you want to delete this bank account?')) {
      await deleteAccount(id);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAccount(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error && accounts.length === 0) {
    return <Error message={error} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header onAddExpense={handleAddAccount} userName="Manage Your Accounts" />
      
      <div className="px-6 py-6">
        {showForm ? (
          <BankAccountForm
            account={editingAccount}
            onSave={handleSaveAccount}
            onCancel={handleCancelForm}
          />
        ) : (
          <BankAccountList
            accounts={accounts}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            onAdd={handleAddAccount}
          />
        )}
      </div>
    </div>
  );
};

export default BankAccounts;