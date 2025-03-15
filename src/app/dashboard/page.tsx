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
import { format, parseISO, subDays } from 'date-fns';
import { Card, Metric, Text, Flex, ProgressBar, Title, TextInput, Button, Select, SelectItem, Badge, Grid, Col } from "@tremor/react";
import { useTheme } from "next-themes";
import { AreaChart, DonutChart } from "@tremor/react";
import { User, Account, Transaction, Statistics } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, BanknotesIcon, ArrowTrendingUpIcon, EyeIcon, EyeSlashIcon, ArrowsRightLeftIcon, BellIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

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

// Generate realistic spending data
const generateSpendingData = () => {
  const data = [];
  const categories = ["Groceries", "Dining", "Shopping", "Transport", "Utilities", "Entertainment"];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = subDays(now, i);
    const dayData = {
      date: format(date, 'MMM dd'),
      total: 0
    };
    
    // Add random spending for each category
    categories.forEach(category => {
      // Weekend spending is higher
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseAmount = isWeekend ? 30 : 15;
      const amount = Math.round(Math.random() * baseAmount) + (isWeekend ? 20 : 5);
      
      dayData[category] = amount;
      dayData.total += amount;
    });
    
    data.push(dayData);
  }
  
  return data;
};

// Generate realistic transaction data
const generateTransactions = () => {
  const merchants = [
    { name: "Whole Foods Market", category: "Groceries", icon: "🛒" },
    { name: "Starbucks", category: "Dining", icon: "☕" },
    { name: "Amazon", category: "Shopping", icon: "📦" },
    { name: "Uber", category: "Transport", icon: "🚗" },
    { name: "Netflix", category: "Entertainment", icon: "🎬" },
    { name: "Electric Company", category: "Utilities", icon: "💡" },
    { name: "Target", category: "Shopping", icon: "🎯" },
    { name: "Chipotle", category: "Dining", icon: "🌮" }
  ];
  
  return Array(5).fill(0).map((_, i) => {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const amount = Math.round(Math.random() * 100) + 5;
    const daysAgo = i === 0 ? 0 : Math.floor(Math.random() * 3) + 1;
    
    return {
      id: `trans-${i}`,
      merchant: merchant.name,
      category: merchant.category,
      icon: merchant.icon,
      amount: amount,
      date: subDays(new Date(), daysAgo),
      type: Math.random() > 0.2 ? "debit" : "credit"
    };
  });
};

// Generate notifications
const generateNotifications = () => {
  return [
    {
      id: "notif-1",
      title: "Large Transaction Alert",
      description: "A transaction of $350.00 was made from your account",
      time: "10 minutes ago",
      read: false,
      type: "alert"
    },
    {
      id: "notif-2",
      title: "New Statement Available",
      description: "Your April statement is ready to view",
      time: "2 hours ago",
      read: true,
      type: "info"
    },
    {
      id: "notif-3",
      title: "Security Update",
      description: "We've enhanced our security measures",
      time: "Yesterday",
      read: true,
      type: "security"
    }
  ];
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
  const [spendingData, setSpendingData] = useState([]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);

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

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate data
        setSpendingData(generateSpendingData());
        setTransactions(generateTransactions());
        setNotifications(generateNotifications());
        
        // Set account balances with some randomness but realistic values
        setAccountBalance(Math.round(Math.random() * 3000) + 1500);
        setSavingsBalance(Math.round(Math.random() * 10000) + 5000);
        
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  // Calculate spending by category for the donut chart
  const categorySpending = spendingData.reduce((acc, day) => {
    Object.keys(day).forEach(key => {
      if (key !== 'date' && key !== 'total') {
        if (!acc[key]) acc[key] = 0;
        acc[key] += day[key];
      }
    });
    return acc;
  }, {});
  
  const categoryData = Object.keys(categorySpending).map(category => ({
    name: category,
    amount: categorySpending[category]
  }));

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
                  Welcome back, {user?.first_name}!
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

            {/* Spending Overview & Recent Transactions */}
            <motion.div variants={item}>
              <Grid numItemsMd={2} className="gap-6">
                <Col>
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                    <Title>Spending Overview</Title>
                    <Text>Your spending patterns for the past 30 days</Text>
                    <AreaChart
                      className="h-72 mt-4"
                      data={spendingData}
                      index="date"
                      categories={["Groceries", "Dining", "Shopping", "Transport", "Utilities", "Entertainment"]}
                      colors={["emerald", "amber", "rose", "blue", "purple", "indigo"]}
                      valueFormatter={(value) => `$${value}`}
                      showAnimation={true}
                    />
                  </Card>
                </Col>
                
                <Col>
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                    <div className="flex justify-between items-center mb-6">
                      <Title>Recent Transactions</Title>
                      <button className="text-sm text-amber-600 dark:text-amber-400 hover:underline">
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg text-xl">
                              {transaction.icon}
                            </div>
                            <div>
                              <Text>{transaction.merchant}</Text>
                              <Text className="text-xs text-gray-500">
                                {format(transaction.date, 'MMM d, yyyy')}
                              </Text>
                            </div>
                          </div>
                          <Text className={transaction.type === 'credit' ? 'text-emerald-600' : 'text-gray-900 dark:text-gray-100'}>
                            {transaction.type === 'credit' ? '+' : '-'}
                            {hideBalances ? '••••' : `$${transaction.amount.toFixed(2)}`}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Grid>
            </motion.div>

            {/* Spending Categories & Notifications */}
            <motion.div variants={item}>
              <Grid numItemsMd={2} className="gap-6">
                <Col>
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                    <Title>Spending by Category</Title>
                    <Text>How you've spent your money this month</Text>
                    <DonutChart
                      className="h-60 mt-4"
                      data={categoryData}
                      category="amount"
                      index="name"
                      valueFormatter={(value) => `$${value.toLocaleString()}`}
                      colors={["emerald", "amber", "rose", "blue", "purple", "indigo"]}
                      showAnimation={true}
                    />
                  </Card>
                </Col>
                
                <Col>
                  <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                        <BellIcon className="w-6 h-6 text-amber-600" />
                      </div>
                      <Title>Notifications</Title>
                    </div>
                    
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg ${
                            notification.read 
                              ? 'bg-gray-50 dark:bg-gray-900/50' 
                              : 'bg-amber-50 dark:bg-amber-900/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              notification.type === 'alert' 
                                ? 'bg-rose-100 dark:bg-rose-900/30' 
                                : notification.type === 'security'
                                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                : 'bg-blue-100 dark:bg-blue-900/30'
                            }`}>
                              {notification.type === 'alert' ? (
                                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                              ) : notification.type === 'security' ? (
                                <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <Text className="font-medium">{notification.title}</Text>
                                {!notification.read && (
                                  <Badge color="amber" size="xs">New</Badge>
                                )}
                              </div>
                              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.description}
                              </Text>
                              <Text className="text-xs text-gray-500 mt-2">
                                {notification.time}
                              </Text>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Col>
              </Grid>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 