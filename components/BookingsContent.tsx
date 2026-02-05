'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus, MoreHorizontal, Check, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockBookings = [
  {
    id: 'BK001',
    guest: 'Sarah Johnson',
    email: 'sarah@example.com',
    accommodation: 'Luxury Safari Lodge',
    checkIn: '2024-02-15',
    checkOut: '2024-02-20',
    nights: 5,
    guests: 2,
    totalPrice: '$2,500',
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 'BK002',
    guest: 'Michael Chen',
    email: 'michael@example.com',
    accommodation: 'Treehouse Retreat',
    checkIn: '2024-02-18',
    checkOut: '2024-02-22',
    nights: 4,
    guests: 1,
    totalPrice: '$1,800',
    status: 'pending',
    paymentStatus: 'pending',
  },
  {
    id: 'BK003',
    guest: 'Emma Williams',
    email: 'emma@example.com',
    accommodation: 'Riverside Camp',
    checkIn: '2024-02-22',
    checkOut: '2024-02-26',
    nights: 4,
    guests: 3,
    totalPrice: '$2,200',
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 'BK004',
    guest: 'James Brown',
    email: 'james@example.com',
    accommodation: 'Luxury Safari Lodge',
    checkIn: '2024-02-25',
    checkOut: '2024-03-01',
    nights: 4,
    guests: 4,
    totalPrice: '$3,100',
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 'BK005',
    guest: 'Lisa Anderson',
    email: 'lisa@example.com',
    accommodation: 'Wellness Retreat',
    checkIn: '2024-03-01',
    checkOut: '2024-03-05',
    nights: 4,
    guests: 2,
    totalPrice: '$1,900',
    status: 'pending',
    paymentStatus: 'partial',
  },
  {
    id: 'BK006',
    guest: 'David Martinez',
    email: 'david@example.com',
    accommodation: 'Mountain View Cabin',
    checkIn: '2024-03-05',
    checkOut: '2024-03-08',
    nights: 3,
    guests: 2,
    totalPrice: '$1,500',
    status: 'cancelled',
    paymentStatus: 'refunded',
  },
];

const statusColors = {
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

const paymentColors = {
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  partial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  refunded: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

export function BookingsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.accommodation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground mt-2">Manage all reservations and guest bookings.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={20} />
          New Booking
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by guest, booking ID or accommodation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['confirmed', 'pending', 'cancelled'].map((status) => (
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

      {/* Results summary */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredBookings.length} of {mockBookings.length} bookings
      </p>

      {/* Bookings Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Booking ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Guest</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Accommodation</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Dates</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Guests</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{booking.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{booking.guest}</p>
                      <p className="text-xs text-muted-foreground">{booking.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{booking.accommodation}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {booking.checkIn} to {booking.checkOut}
                    <p className="text-xs text-muted-foreground">{booking.nights} nights</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{booking.guests}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{booking.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${paymentColors[booking.paymentStatus as keyof typeof paymentColors]}`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
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
