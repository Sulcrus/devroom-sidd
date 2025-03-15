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
import { Card, Metric, Text, Flex, ProgressBar, Title, TextInput, Button, Select, SelectItem, Badge } from "@tremor/react";
import { useTheme } from "next-themes";
import { AreaChart, DonutChart } from "@tremor/react";
import { User, Account, Transaction, Statistics } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, BanknotesIcon } from "@heroicons/react/24/outline";

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
  const { user } = useUserStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        if (!user) {
          router.push('/login');
          return;
        }

        // Fetch data in parallel
        const [accountsRes, transactionsRes, statsRes] = await Promise.all([
          fetch('/api/accounts', { credentials: 'include' }),
          fetch('/api/transactions?limit=5', { credentials: 'include' }),
          fetch('/api/statistics', { credentials: 'include' })
        ]);

        // Handle response errors
        if (!accountsRes.ok || !transactionsRes.ok || !statsRes.ok) {
          const errorData = await accountsRes.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch dashboard data');
        }

        // Parse responses
        const [accountsData, transactionsData, statsData] = await Promise.all([
          accountsRes.json(),
          transactionsRes.json(),
          statsRes.json()
        ]);

        // Update state
        setAccounts(accountsData);
        setTransactions(transactionsData);
        setStatistics(statsData);

        // Show success toast
        toast.success('Dashboard updated');

      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');

        // Handle authentication errors
        if (err.message?.includes('unauthorized')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, router]);

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

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      if (!res.ok) {
        const error = await res.json();
        console.error("Error response:", error);
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(error.error || "Failed to fetch accounts");
      }
      const data = await res.json();
      console.log("Fetched accounts:", data);
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Loading state with animation
  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="space-y-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto" />
          <Text>Loading your financial overview...</Text>
        </div>
      </motion.div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <Card className="max-w-lg mx-auto p-6">
          <div className="text-center space-y-4">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <Title className="text-red-600">Error Loading Dashboard</Title>
            <Text>{error}</Text>
            <Button 
              onClick={() => window.location.reload()}
              color="amber"
              size="lg"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800"
      >
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.first_name || 'User'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's your financial summary for today
              </p>
            </motion.div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-amber-100/20 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <BanknotesIcon className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                  </div>
                  <div>
                    <Text>Total Balance</Text>
                    <Metric className="text-amber-600 dark:text-amber-500">
                      ${statistics?.totalBalance.toLocaleString()}
                    </Metric>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-green-100/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <ArrowUpIcon className="w-6 h-6 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <Text>Monthly Income</Text>
                    <Metric className="text-green-600 dark:text-green-500">
                      ${statistics?.monthlyIncome.toLocaleString()}
                    </Metric>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-red-100/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <ArrowDownIcon className="w-6 h-6 text-red-600 dark:text-red-500" />
                  </div>
                  <div>
                    <Text>Monthly Spending</Text>
                    <Metric className="text-red-600 dark:text-red-500">
                      ${statistics?.monthlySpending.toLocaleString()}
                    </Metric>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Chart Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-100/20">
              <Title>Income vs Spending Trends</Title>
              <div className="h-[400px] mt-4">
                <AreaChart
                  data={statistics?.transactionStats || []}
                  index="date"
                  categories={["income", "spending"]}
                  colors={["emerald", "rose"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                  showLegend
                  showGridLines={false}
                  curveType="natural"
                  className="h-full"
                />
              </div>
            </Card>
          </motion.div>

          {/* Accounts Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {accounts.map((account, index) => (
                <Card
                  key={account.id}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-100/20 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <CreditCardIcon className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                      </div>
                      <div>
                        <Text>{account.account_type.toUpperCase()}</Text>
                        <Text className="text-xs text-gray-500">
                          •••• {account.account_number.slice(-4)}
                        </Text>
                      </div>
                    </div>
                    <Badge color={
                      account.status === 'active' ? 'green' :
                      account.status === 'frozen' ? 'red' : 'gray'
                    }>
                      {account.status}
                    </Badge>
                  </div>
                  <Metric className="mt-4">
                    {account.currency} {account.balance.toLocaleString()}
                  </Metric>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-100/20">
              <Title>Recent Transactions</Title>
              <div className="divide-y dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {transaction.type === 'deposit' ? 
                          <ArrowUpIcon className="w-5 h-5 text-green-600 dark:text-green-500" /> :
                          <ArrowDownIcon className="w-5 h-5 text-red-600 dark:text-red-500" />
                        }
                      </div>
                      <div>
                        <Text>{transaction.description}</Text>
                        <Text className="text-xs text-gray-500">
                          {format(new Date(transaction.created_at), 'MMM d, yyyy')}
                        </Text>
                      </div>
                    </div>
                    <Text className={
                      transaction.type === 'deposit' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                    }>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      ${transaction.amount.toLocaleString()}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 