"use client"

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { ExpenseForm } from '@/components/expense/expense-form';
import { ExpenseList } from '@/components/expense/expense-list';
import { BalanceCards } from '@/components/dashboard/balance-cards';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const handleRefresh = () => {
    setRefreshData(!refreshData);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {isLogin ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onToggleMode={() => setIsLogin(false)}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onToggleMode={() => setIsLogin(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Expense Tracker</h1>
          <div className="flex items-center gap-4">
            <ExpenseForm onSuccess={handleRefresh} />
            <ThemeToggle />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <BalanceCards refresh={refreshData} />
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <ExpenseList refresh={refreshData} onRefresh={handleRefresh} />
          </div>
        </div>
      </main>
    </div>
  );
}
