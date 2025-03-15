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
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, BanknotesIcon, ArrowTrendingUpIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [hideBalances, setHideBalances] = useState(false);

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
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Welcome back, {user?.first_name}! ��
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Here's your financial overview
                </p>
              </div>
              <button
                onClick={() => setHideBalances(!hideBalances)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {hideBalances ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Balance Cards */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card 
                className="bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:shadow-lg transition-shadow duration-200"
                decoration="top"
                decorationColor="amber"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <BanknotesIcon className="w-6 h-6 text-white" />
                  </div>
                  <Badge color="white" size="sm">Total Balance</Badge>
                </div>
                <Metric className="text-white">
                  {hideBalances ? '••••••' : `$${statistics?.totalBalance.toLocaleString()}`}
                </Metric>
                <Text className="text-white/80 mt-2">Across all accounts</Text>
              </Card>

              <Card 
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                decoration="top"
                decorationColor="emerald"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <Badge color="white" size="sm">Monthly Income</Badge>
                </div>
                <Metric className="text-white">
                  {hideBalances ? '••••••' : `$${statistics?.monthlyIncome.toLocaleString()}`}
                </Metric>
                <Text className="text-white/80 mt-2">Last 30 days</Text>
              </Card>

              <Card 
                className="bg-gradient-to-br from-rose-500 to-rose-600 text-white"
                decoration="top"
                decorationColor="rose"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <ArrowDownIcon className="w-6 h-6 text-white" />
                  </div>
                  <Badge color="white" size="sm">Monthly Spending</Badge>
                </div>
                <Metric className="text-white">
                  {hideBalances ? '••••••' : `$${statistics?.monthlySpending.toLocaleString()}`}
                </Metric>
                <Text className="text-white/80 mt-2">Last 30 days</Text>
              </Card>
            </motion.div>

            {/* Chart Section */}
            <motion.div variants={item}>
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Title>Financial Overview</Title>
                    <Text>Income vs Spending Trends</Text>
                  </div>
                  <div className="flex gap-2">
                    <Badge color="emerald">Income</Badge>
                    <Badge color="rose">Spending</Badge>
                  </div>
                </div>
                <div className="h-[400px] mt-4">
                  <AreaChart
                    data={statistics?.transactionStats || []}
                    index="date"
                    categories={["income", "spending"]}
                    colors={["emerald", "rose"]}
                    valueFormatter={(value) => `$${value.toLocaleString()}`}
                    showLegend={false}
                    showGridLines={false}
                    curveType="natural"
                    className="h-full"
                    showAnimation={true}
                  />
                </div>
              </Card>
            </motion.div>

            {/* Accounts Section */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-4">
                <Title>Your Accounts</Title>
                <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {accounts.map((account) => (
                  <Card
                    key={account.id}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                          <CreditCardIcon className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <Text>{account.account_type.toUpperCase()}</Text>
                          <Text className="text-xs text-gray-500">
                            •••• {account.account_number.slice(-4)}
                          </Text>
                        </div>
                      </div>
                      <Badge color={
                        account.status === 'active' ? 'emerald' :
                        account.status === 'frozen' ? 'rose' : 'gray'
                      }>
                        {account.status}
                      </Badge>
                    </div>
                    <Metric>
                      {hideBalances ? '••••••' : `${account.currency} ${account.balance.toLocaleString()}`}
                    </Metric>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div variants={item}>
              <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                <div className="flex items-center justify-between mb-6">
                  <Title>Recent Transactions</Title>
                  <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                    See All
                  </button>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          transaction.type === 'deposit' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                            : 'bg-rose-100 dark:bg-rose-900/30'
                        }`}>
                          {transaction.type === 'deposit' ? 
                            <ArrowUpIcon className="w-5 h-5 text-emerald-600" /> :
                            <ArrowDownIcon className="w-5 h-5 text-rose-600" />
                          }
                        </div>
                        <div>
                          <Text>{transaction.description}</Text>
                          <Text className="text-xs text-gray-500">
                            {format(new Date(transaction.created_at), 'MMM d, yyyy • h:mm a')}
                          </Text>
                        </div>
                      </div>
                      <Text className={
                        transaction.type === 'deposit' 
                          ? 'text-emerald-600 dark:text-emerald-500' 
                          : 'text-rose-600 dark:text-rose-500'
                      }>
                        {transaction.type === 'deposit' ? '+' : '-'}
                        ${hideBalances ? '••••' : transaction.amount.toLocaleString()}
                      </Text>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 