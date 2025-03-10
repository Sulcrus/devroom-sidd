"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, TextInput, Button, Select, SelectItem, Badge, Metric } from "@tremor/react";
import { Account, User } from "@/types";
import { motion } from "framer-motion";
import { 
  BanknotesIcon, 
  CreditCardIcon, 
  BuildingLibraryIcon,
  PhoneIcon
} from "@heroicons/react/24/outline";

const PAYMENT_CATEGORIES = [
  { id: 'utilities', name: 'Utilities', icon: BuildingLibraryIcon },
  { id: 'mobile', name: 'Mobile Recharge', icon: PhoneIcon },
  { id: 'credit-card', name: 'Credit Card', icon: CreditCardIcon },
  { id: 'other', name: 'Other Payments', icon: BanknotesIcon },
];

export default function PaymentsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fromAccountId: "",
    category: "",
    billerId: "",
    amount: "",
    description: "",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const account = accounts.find(a => a.id === formData.fromAccountId);
    setSelectedAccount(account || null);
  }, [formData.fromAccountId, accounts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAccountId: formData.fromAccountId,
          billerId: formData.billerId,
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setSuccess(`Payment successful! Reference: ${data.referenceNumber}`);
      setFormData({
        fromAccountId: "",
        category: "",
        billerId: "",
        amount: "",
        description: "",
      });

      // Refresh account data
      fetchAccounts();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Make a Payment
          </h1>
          <Text className="mt-2 text-gray-600 dark:text-gray-400">
            Pay your bills and make other payments
          </Text>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Payment Categories */}
          <div className="lg:col-span-8">
            <div className="grid gap-6 md:grid-cols-2">
              {PAYMENT_CATEGORIES.map(({ id, name, icon: Icon }) => (
                <Card 
                  key={id}
                  className={`p-6 cursor-pointer transition-all ${
                    formData.category === id 
                      ? 'ring-2 ring-amber-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, category: id }))}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                      <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <Title>{name}</Title>
                  </div>
                </Card>
              ))}
            </div>

            {/* Payment Form */}
            {formData.category && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <Card className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Text>From Account</Text>
                      <Select
                        value={formData.fromAccountId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, fromAccountId: value }))}
                        placeholder="Select account"
                      >
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_type.toUpperCase()} - {account.currency} {account.balance.toLocaleString()}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Text>Biller ID / Account Number</Text>
                      <TextInput
                        value={formData.billerId}
                        onChange={(e) => setFormData(prev => ({ ...prev, billerId: e.target.value }))}
                        placeholder="Enter biller ID or account number"
                      />
                    </div>

                    <div>
                      <Text>Amount</Text>
                      <TextInput
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Enter amount"
                        type="number"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <Text>Description (Optional)</Text>
                      <TextInput
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Add a note"
                      />
                    </div>

                    <Button
                      type="submit"
                      color="amber"
                      size="lg"
                      loading={submitting}
                      disabled={!formData.fromAccountId || !formData.billerId || !formData.amount}
                      className="w-full"
                    >
                      Make Payment
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {selectedAccount && (
              <Card className="p-6">
                <Title>Selected Account</Title>
                <div className="mt-4 space-y-4">
                  <div>
                    <Text className="text-gray-600 dark:text-gray-400">Account Type</Text>
                    <Text className="font-medium">{selectedAccount.account_type.toUpperCase()}</Text>
                  </div>
                  <div>
                    <Text className="text-gray-600 dark:text-gray-400">Available Balance</Text>
                    <Metric className="text-amber-500">
                      {selectedAccount.currency} {selectedAccount.balance.toLocaleString()}
                    </Metric>
                  </div>
                  <div>
                    <Text className="text-gray-600 dark:text-gray-400">Status</Text>
                    <Badge color={selectedAccount.status === 'active' ? 'green' : 'red'}>
                      {selectedAccount.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Status Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <Text className="text-red-600">{error}</Text>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <Text className="text-green-600">{success}</Text>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 