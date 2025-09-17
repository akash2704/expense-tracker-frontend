"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CreditCard } from 'lucide-react';
import { expenseApi } from '@/lib/api';

interface BalanceCardsProps {
  refresh: boolean;
}

export function BalanceCards({ refresh }: BalanceCardsProps) {
  const [balances, setBalances] = useState({ cash_balance: 0, bank_balance: 0 });
  const [loading, setLoading] = useState(true);

  const fetchBalances = async () => {
    try {
      const response = await expenseApi.getBalance();
      setBalances(response.data);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [refresh]);

  if (loading) return <div>Loading balances...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(balances.cash_balance / 100).toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(balances.bank_balance / 100).toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
