"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, AreaChart, DonutChart, BarChart, Metric, Badge } from "@tremor/react";
import { motion } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { format, subDays, subMonths } from "date-fns";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  HomeIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

// Generate realistic mock data
const generateMockData = (period: 'week' | 'month' | 'year') => {
  const now = new Date();
  let dailyStats = [];
  let transactionTypes = [
    { name: 'Food & Dining', amount: 0 },
    { name: 'Shopping', amount: 0 },
    { name: 'Housing', amount: 0 },
    { name: 'Transportation', amount: 0 },
    { name: 'Entertainment', amount: 0 },
    { name: 'Healthcare', amount: 0 },
  ];
  let monthlyComparison = [];
  
  // Generate daily stats
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
  let totalIncome = 0;
  let totalSpending = 0;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = period === 'week' ? subDays(now, i) : 
                 period === 'month' ? subDays(now, i) : 
                 subDays(now, Math.floor(i * (365/days)));
    
    // More realistic income (biweekly for salary)
    const isPayday = date.getDate() === 15 || date.getDate() === 30;
    const income = isPayday ? Math.floor(Math.random() * 1000) + 2000 : Math.floor(Math.random() * 200);
    
    // More realistic spending patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const spending = isWeekend ? 
      Math.floor(Math.random() * 150) + 50 : 
      Math.floor(Math.random() * 80) + 20;
    
    totalIncome += income;
    totalSpending += spending;
    
    dailyStats.push({
      date: format(date, 'MMM dd'),
      income,
      spending
    });
  }
  
  // Generate transaction types with realistic proportions
  const totalAmount = totalSpending;
  transactionTypes[0].amount = Math.round(totalAmount * 0.25); // Food
  transactionTypes[1].amount = Math.round(totalAmount * 0.20); // Shopping
  transactionTypes[2].amount = Math.round(totalAmount * 0.30); // Housing
  transactionTypes[3].amount = Math.round(totalAmount * 0.10); // Transportation
  transactionTypes[4].amount = Math.round(totalAmount * 0.08); // Entertainment
  transactionTypes[5].amount = Math.round(totalAmount * 0.07); // Healthcare
  
  // Generate monthly comparison (last 6 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthIndex = monthDate.getMonth();
    
    monthlyComparison.push({
      month: monthNames[monthIndex],
      income: Math.floor(Math.random() * 2000) + 3000,
      spending: Math.floor(Math.random() * 1500) + 1500
    });
  }
  
  return {
    dailyStats,
    transactionTypes,
    monthlyComparison,
    averageIncome: Math.round(totalIncome / days),
    averageSpending: Math.round(totalSpending / days),
    transactionCount: Math.floor(Math.random() * 50) + days,
    savingsRate: Math.round(((totalIncome - totalSpending) / totalIncome) * 100)
  };
};

export default function AnalyticsPage() {
  const { user } = useUserStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const res = await fetch(`/api/statistics?period=${selectedPeriod}`);
      // const data = await res.json();
      
      // For now, we'll use our mock data generator
      const mockData = generateMockData(selectedPeriod);
      setStats(mockData);
    } catch (error) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={item} className="flex justify-between items-center">
          <div>
            <Title>Financial Analytics</Title>
            <Text>Detailed analysis of your financial activities</Text>
          </div>
          <div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-lg">
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedPeriod === period 
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card 
            decoration="top"
            decorationColor="emerald"
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <ArrowTrendingUpIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <Text>Average Income</Text>
                <Metric>${stats?.averageIncome?.toLocaleString()}</Metric>
              </div>
            </div>
          </Card>

          <Card 
            decoration="top"
            decorationColor="rose"
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <Text>Average Spending</Text>
                <Metric>${stats?.averageSpending?.toLocaleString()}</Metric>
              </div>
            </div>
          </Card>

          <Card 
            decoration="top"
            decorationColor="blue"
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ArrowPathIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <Text>Transaction Count</Text>
                <Metric>{stats?.transactionCount?.toLocaleString()}</Metric>
              </div>
            </div>
          </Card>

          <Card 
            decoration="top"
            decorationColor="amber"
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <Text>Savings Rate</Text>
                <div className="flex items-center gap-2">
                  <Metric>{stats?.savingsRate}%</Metric>
                  <Badge color={stats?.savingsRate > 20 ? 'emerald' : stats?.savingsRate > 10 ? 'amber' : 'rose'}>
                    {stats?.savingsRate > 20 ? 'Good' : stats?.savingsRate > 10 ? 'Average' : 'Low'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Charts */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <Title>Income vs Spending Trend</Title>
            <AreaChart
              className="h-72 mt-4"
              data={stats?.dailyStats || []}
              index="date"
              categories={["income", "spending"]}
              colors={["emerald", "rose"]}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              showAnimation={true}
            />
          </Card>

          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <Title>Spending Distribution</Title>
            <DonutChart
              className="h-72 mt-4"
              data={stats?.transactionTypes || []}
              category="amount"
              index="name"
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              colors={["emerald", "rose", "amber", "blue", "indigo", "purple"]}
              showAnimation={true}
            />
          </Card>
        </motion.div>

        {/* Monthly Comparison */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <Title>Monthly Comparison</Title>
            <BarChart
              className="h-80 mt-4"
              data={stats?.monthlyComparison || []}
              index="month"
              categories={["income", "spending"]}
              colors={["emerald", "rose"]}
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              showAnimation={true}
            />
          </Card>
        </motion.div>

        {/* Spending Categories */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <Title>Top Spending Categories</Title>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
              {[
                { name: 'Food & Dining', icon: ShoppingBagIcon, color: 'emerald' },
                { name: 'Shopping', icon: ShoppingBagIcon, color: 'rose' },
                { name: 'Housing', icon: HomeIcon, color: 'amber' },
                { name: 'Transportation', icon: DevicePhoneMobileIcon, color: 'blue' },
                { name: 'Entertainment', icon: AcademicCapIcon, color: 'indigo' },
                { name: 'Healthcare', icon: HeartIcon, color: 'purple' },
              ].map((category, index) => {
                const amount = stats?.transactionTypes?.[index]?.amount || 0;
                return (
                  <Card key={category.name} className="bg-white dark:bg-gray-800">
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 bg-${category.color}-100 dark:bg-${category.color}-900/30 rounded-xl mb-2`}>
                        <category.icon className={`w-6 h-6 text-${category.color}-600`} />
                      </div>
                      <Text>{category.name}</Text>
                      <Text className="text-gray-500">${amount.toLocaleString()}</Text>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 