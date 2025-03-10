"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import { Card, Metric, Text, Flex, ProgressBar, Title } from "@tremor/react";
import { useTheme } from "next-themes";
import { AreaChart, DonutChart } from "@tremor/react";
import { User, Account, Transaction, Statistics } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [userRes, accountsRes, transactionsRes, statsRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/accounts'),
        fetch(`/api/transactions?period=${period}`),
        fetch('/api/statistics')
      ]);

      if (!userRes.ok) {
        if (userRes.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch user data');
      }

      if (!accountsRes.ok || !transactionsRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [userData, accountsData, transactionsData, statsData] = await Promise.all([
        userRes.json(),
        accountsRes.json(),
        transactionsRes.json(),
        statsRes.json()
      ]);

      setUser(userData);
      setAccounts(accountsData);
      setTransactions(transactionsData);
      setStatistics(statsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const chartData = {
    labels: statistics?.transactionStats.map(stat => 
      format(parseISO(stat.date), 'MMM d')
    ) || [],
    datasets: [
      {
        label: 'Income',
        data: statistics?.transactionStats.map(stat => stat.income) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Spending',
        data: statistics?.transactionStats.map(stat => stat.spending) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.first_name || 'User'}!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Here's your financial overview
          </p>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="dark:bg-gray-800">
          <Text>Total Balance</Text>
          <Metric className="text-amber-600">
            ${statistics?.totalBalance.toLocaleString()}
          </Metric>
          <Text className="text-sm text-gray-500">
            Across all accounts
          </Text>
        </Card>
        
        <Card className="dark:bg-gray-800">
          <Text>Monthly Income</Text>
          <Metric className="text-green-600">
            ${statistics?.monthlyIncome.toLocaleString()}
          </Metric>
          <Text className="text-sm text-gray-500">
            Last 30 days
          </Text>
        </Card>
        
        <Card className="dark:bg-gray-800">
          <Text>Monthly Spending</Text>
          <Metric className="text-red-600">
            ${statistics?.monthlySpending.toLocaleString()}
          </Metric>
          <Text className="text-sm text-gray-500">
            Last 30 days
          </Text>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="dark:bg-gray-800">
          <Title>Income vs Spending</Title>
          <AreaChart
            data={statistics?.transactionStats || []}
            index="date"
            categories={["income", "spending"]}
            colors={["emerald", "rose"]}
            valueFormatter={(value) => `$${value.toLocaleString()}`}
            showLegend
            className="h-72"
          />
        </Card>

        <Card className="dark:bg-gray-800">
          <Title>Spending by Category</Title>
          <DonutChart
            data={statistics?.spendingByCategory || []}
            category="amount"
            index="category"
            valueFormatter={(value) => `$${value.toLocaleString()}`}
            colors={statistics?.spendingByCategory?.map(cat => cat.color) || []}
            className="h-72"
          />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className="dark:bg-gray-800 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <Text>{account.account_type.toUpperCase()}</Text>
                <Text className="text-xs text-gray-500">
                  {account.account_number}
                </Text>
              </div>
              <div className={`px-2 py-1 rounded text-xs ${
                account.status === 'active' ? 'bg-green-100 text-green-800' :
                account.status === 'frozen' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {account.status}
              </div>
            </div>
            <Metric className="mt-4">
              {account.currency} {account.balance.toLocaleString()}
            </Metric>
          </Card>
        ))}
      </div>

      <Card className="dark:bg-gray-800">
        <Title>Recent Transactions</Title>
        <div className="divide-y dark:divide-gray-700">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: transaction.category_color + '20', color: transaction.category_color }}
                >
                  <span className="text-lg">{transaction.category_icon}</span>
                </div>
                <div>
                  <Text>{transaction.description}</Text>
                  <Text className="text-xs text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()} • 
                    {transaction.reference_number}
                  </Text>
                </div>
              </div>
              <div className="text-right">
                <Text className={
                  transaction.type === 'deposit' ? 'text-green-600' :
                  transaction.type === 'withdrawal' ? 'text-red-600' :
                  'text-gray-600'
                }>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  ${transaction.amount.toLocaleString()}
                </Text>
                <Text className="text-xs text-gray-500">
                  {transaction.category_name}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 