'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, MoreHorizontal, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockPayments = [
  {
    id: 'PAY001',
    bookingId: 'BK001',
    guest: 'Sarah Johnson',
    amount: '$2,500',
    currency: 'USD',
    method: 'Credit Card',
    date: '2024-02-10',
    status: 'completed',
    reference: 'TXN2024021001',
  },
  {
    id: 'PAY002',
    bookingId: 'BK002',
    guest: 'Michael Chen',
    amount: '$900',
    currency: 'USD',
    method: 'Bank Transfer',
    date: '2024-02-12',
    status: 'pending',
    reference: 'TXN2024021102',
  },
  {
    id: 'PAY003',
    bookingId: 'BK003',
    guest: 'Emma Williams',
    amount: '$2,200',
    currency: 'USD',
    method: 'Credit Card',
    date: '2024-02-15',
    status: 'completed',
    reference: 'TXN2024021503',
  },
  {
    id: 'PAY004',
    bookingId: 'BK004',
    guest: 'James Brown',
    amount: '$3,100',
    currency: 'USD',
    method: 'PayPal',
    date: '2024-02-18',
    status: 'completed',
    reference: 'TXN2024021804',
  },
  {
    id: 'PAY005',
    bookingId: 'BK005',
    guest: 'Lisa Anderson',
    amount: '$950',
    currency: 'USD',
    method: 'Credit Card',
    date: '2024-02-20',
    status: 'pending',
    reference: 'TXN2024022005',
  },
  {
    id: 'PAY006',
    bookingId: 'BK001',
    guest: 'Sarah Johnson',
    amount: '$1,600',
    currency: 'USD',
    method: 'Credit Card',
    date: '2024-02-22',
    status: 'failed',
    reference: 'TXN2024022206',
  },
];

const statusColors = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

const paymentStats = [
  { label: 'Total Revenue', value: '$10,350', change: '+18%' },
  { label: 'Pending Payments', value: '$1,850', change: '2 transactions' },
  { label: 'Success Rate', value: '95.2%', change: '+2.5%' },
];

export function PaymentsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payments</h1>
        <p className="text-muted-foreground mt-2">Track and manage all booking payments.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paymentStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-3">{stat.change}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by guest, payment ID or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['completed', 'pending', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all',
                  statusFilter === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-border'
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredPayments.length} of {mockPayments.length} payments
      </p>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Booking</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Guest</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Method</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{payment.id}</p>
                      <p className="text-xs text-muted-foreground">{payment.reference}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{payment.bookingId}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{payment.guest}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{payment.amount}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{payment.method}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{payment.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[payment.status as keyof typeof statusColors]
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-border rounded-lg transition-colors">
                      <MoreHorizontal size={18} className="text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
