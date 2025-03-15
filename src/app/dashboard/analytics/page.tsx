"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, AreaChart, DonutChart, BarChart, Metric, Badge, Tab, TabList } from "@tremor/react";
import { motion } from "framer-motion";
import useUserStore from "@/store/useUserStore";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ArrowPathIcon,
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
      const res = await fetch(`/api/statistics?period=${selectedPeriod}`);
      const data = await res.json();
      setStats(data);
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
          <TabList
            defaultValue="month"
            onValueChange={(value) => setSelectedPeriod(value as any)}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
          >
            <Tab value="week" text="Week" />
            <Tab value="month" text="Month" />
            <Tab value="year" text="Year" />
          </TabList>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            decorationColor="amber"
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-amber-600" />
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
                <Text>Transaction Volume</Text>
                <Metric>{stats?.transactionCount?.toLocaleString()}</Metric>
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
            <Title>Transaction Distribution</Title>
            <DonutChart
              className="h-72 mt-4"
              data={stats?.transactionTypes || []}
              category="amount"
              index="name"
              valueFormatter={(value) => `$${value.toLocaleString()}`}
              colors={["emerald", "rose", "amber", "blue"]}
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
      </motion.div>
    </div>
  );
} 