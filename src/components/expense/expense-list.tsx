"use client"

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { expenseApi, Expense } from '@/lib/api';
import { format } from 'date-fns';

interface ExpenseListProps {
  refresh: boolean;
  onRefresh: () => void;
}

export function ExpenseList({ refresh, onRefresh }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const response = await expenseApi.getExpenses();
      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await expenseApi.deleteExpense(id);
        fetchExpenses();
        onRefresh();
      } catch (error) {
        alert('Failed to delete expense');
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [refresh]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <Badge variant={expense.type === 'income' ? 'default' : 'destructive'}>
                  {expense.type}
                </Badge>
              </TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.description || '-'}</TableCell>
              <TableCell className={expense.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                {expense.type === 'income' ? '+' : '-'}${(expense.amount / 100).toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{expense.payment_method}</Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
