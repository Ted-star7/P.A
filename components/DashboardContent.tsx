'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const dashboardStats = [
  {
    label: 'Total Bookings',
    value: '342',
    change: '+12%',
    trend: 'up',
    icon: Calendar,
    color: 'bg-primary',
  },
  {
    label: 'Active Guests',
    value: '156',
    change: '+8%',
    trend: 'up',
    icon: Users,
    color: 'bg-accent',
  },
  {
    label: 'Revenue (Month)',
    value: '$48,500',
    change: '+24%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-secondary',
  },
  {
    label: 'Occupancy Rate',
    value: '87%',
    change: '-2%',
    trend: 'down',
    icon: TrendingUp,
    color: 'bg-primary',
  },
];

const revenueData = [
  { month: 'Jan', revenue: 24000, expenses: 12000 },
  { month: 'Feb', revenue: 28000, expenses: 14000 },
  { month: 'Mar', revenue: 32000, expenses: 15000 },
  { month: 'Apr', revenue: 35000, expenses: 16000 },
  { month: 'May', revenue: 42000, expenses: 18000 },
  { month: 'Jun', revenue: 48500, expenses: 20000 },
];

const bookingSourceData = [
  { name: 'Direct Booking', value: 45, fill: 'var(--color-primary)' },
  { name: 'OTA Platforms', value: 30, fill: 'var(--color-accent)' },
  { name: 'Travel Agencies', value: 15, fill: 'var(--color-secondary)' },
  { name: 'Referrals', value: 10, fill: 'var(--color-muted)' },
];

const recentBookings = [
  { id: 1, guest: 'Sarah Johnson', accommodation: 'Luxury Safari Lodge', checkIn: '2024-02-15', status: 'Confirmed' },
  { id: 2, guest: 'Michael Chen', accommodation: 'Treehouse Retreat', checkIn: '2024-02-18', status: 'Pending' },
  { id: 3, guest: 'Emma Williams', accommodation: 'Riverside Camp', checkIn: '2024-02-22', status: 'Confirmed' },
  { id: 4, guest: 'James Brown', accommodation: 'Luxury Safari Lodge', checkIn: '2024-02-25', status: 'Confirmed' },
  { id: 5, guest: 'Lisa Anderson', accommodation: 'Wellness Retreat', checkIn: '2024-03-01', status: 'Pending' },
];

const upcomingActivities = [
  { id: 1, name: 'Sunrise Safari', date: '2024-02-15', guests: 12, guide: 'David Kipchoge' },
  { id: 2, name: 'Bird Watching Tour', date: '2024-02-16', guests: 8, guide: 'Jane Kamau' },
  { id: 3, name: 'Night Game Drive', date: '2024-02-17', guests: 15, guide: 'Robert Okonkwo' },
  { id: 4, name: 'Guided Nature Walk', date: '2024-02-18', guests: 10, guide: 'Mary Wanjiru' },
];

export function DashboardContent() {
  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's your resort overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownLeft;
          const trendColor = stat.trend === 'up' ? 'text-green-600' : 'text-red-600';

          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                <TrendIcon size={16} className={trendColor} />
                <span className={`text-sm font-medium ${trendColor}`}>{stat.change}</span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="var(--color-primary)" />
              <Bar dataKey="expenses" fill="var(--color-muted)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Booking Source */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Booking Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bookingSourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {bookingSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Recent Bookings</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between pb-4 border-b border-border last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{booking.guest}</p>
                  <p className="text-sm text-muted-foreground">{booking.accommodation}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Confirmed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Upcoming Activities</h2>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {upcomingActivities.map((activity) => (
              <div key={activity.id} className="pb-4 border-b border-border last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.guide}</p>
                  </div>
                  <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                    {activity.guests} guests
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{activity.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
