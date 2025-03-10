export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_type: 'savings' | 'checking' | 'business';
  balance: number;
  currency: string;
  status: 'active' | 'inactive' | 'frozen';
  created_at: string;
}

export interface Transaction {
  id: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  type: 'transfer' | 'deposit' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  reference_number: string;
  category_id: string;
  created_at: string;
  category_name?: string;
  category_icon?: string;
  category_color?: string;
  from_account_number?: string;
  to_account_number?: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Statistics {
  totalBalance: number;
  monthlySpending: number;
  monthlyIncome: number;
  transactionStats: {
    date: string;
    income: number;
    spending: number;
  }[];
  spendingByCategory: {
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }[];
} 