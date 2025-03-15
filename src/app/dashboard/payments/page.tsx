"use client";

import { useState } from "react";
import { Card, Title, Text, TextInput, Button, Badge, Metric } from "@tremor/react";
import { motion } from "framer-motion";
import {
  CreditCardIcon,
  BuildingLibraryIcon,
  PhoneIcon,
  LightBulbIcon,
  WifiIcon,
  TvIcon,
  GlobeAltIcon,
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

const billCategories = [
  { id: 'utilities', name: 'Utilities', icon: LightBulbIcon },
  { id: 'internet', name: 'Internet', icon: WifiIcon },
  { id: 'phone', name: 'Phone', icon: PhoneIcon },
  { id: 'tv', name: 'TV & Cable', icon: TvIcon },
  { id: 'education', name: 'Education', icon: BuildingLibraryIcon },
  { id: 'other', name: 'Other', icon: GlobeAltIcon },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('bills');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={item}>
          <Title>Bill Payments</Title>
          <Text>Pay your bills securely and easily</Text>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={item}>
          <div className="flex bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-lg">
            {['bills', 'scheduled', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab 
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                {tab === 'bills' ? 'Bills & Utilities' : 
                 tab === 'scheduled' ? 'Scheduled' : 'History'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {billCategories.map((category) => (
              <Card 
                key={category.id}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                    <category.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <Text>{category.name}</Text>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Payments */}
        <motion.div variants={item}>
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg">
            <Title>Recent Payments</Title>
            <div className="mt-4 space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <LightBulbIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <Text>Electricity Bill</Text>
                      <Text className="text-xs text-gray-500">Paid on Mar 15, 2024</Text>
                    </div>
                  </div>
                  <Badge color="emerald">Paid</Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Scheduled Payments */}
        <motion.div variants={item}>
          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-white/80">Next Payment Due</Text>
                <Metric className="text-white">Internet Bill</Metric>
                <Text className="text-white/80 mt-1">Due in 5 days</Text>
              </div>
              <Button 
                size="sm"
                color="amber"
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                Pay Now
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
} 