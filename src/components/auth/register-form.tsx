"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/lib/api';

interface RegisterFormProps {
  onSuccess: () => void;
  onToggleMode: () => void;
}

export function RegisterForm({ onSuccess, onToggleMode }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [initialBank, setInitialBank] = useState('');
  const [initialCash, setInitialCash] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await authApi.register({
        username,
        password,
        initial_bank: parseInt(initialBank) * 100, // Convert to cents
        initial_cash: parseInt(initialCash) * 100, // Convert to cents
      });
      alert('Registration successful! Please login.');
      onToggleMode();
    } catch (error) {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="initialBank">Initial Bank Balance</Label>
            <Input
              id="initialBank"
              type="number"
              value={initialBank}
              onChange={(e) => setInitialBank(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="initialCash">Initial Cash Balance</Label>
            <Input
              id="initialCash"
              type="number"
              value={initialCash}
              onChange={(e) => setInitialCash(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Button type="button" variant="link" onClick={onToggleMode} className="w-full">
            Already have an account? Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
