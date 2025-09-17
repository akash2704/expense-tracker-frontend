import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Expense {
  id: number;
  amount: number;
  category: string;
  description?: string;
  type: 'expense' | 'income';
  payment_method: 'cash' | 'transfer';
  date: string;
  user_id: number;
  budget_id?: number;
}

export interface ExpenseCreate {
  amount: number;
  category: string;
  description?: string;
  type: 'expense' | 'income';
  payment_method: 'cash' | 'transfer';
  date: string;
  budget_id?: number;
}

export interface User {
  id: number;
  username: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  initial_bank: number;
  initial_cash: number;
}

export const authApi = {
  login: (data: LoginData) => {
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (data: RegisterData) => api.post('/auth/register', data),
};

export const expenseApi = {
  getExpenses: (skip = 0, limit = 100) => api.get(`/expense/?skip=${skip}&limit=${limit}`),
  createExpense: (data: ExpenseCreate) => api.post('/expense/', data),
  updateExpense: (id: number, data: Partial<ExpenseCreate>) => api.patch(`/expense/${id}`, data),
  deleteExpense: (id: number) => api.delete(`/expense/${id}`),
  getBalance: () => api.get('/expense/balance'),
};
