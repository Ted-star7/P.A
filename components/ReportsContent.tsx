'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyRevenueData = [
  { month: 'Jan', revenue: 24000, bookings: 18 },
  { month: 'Feb', revenue: 28000, bookings: 22 },
  { month: 'Mar', revenue: 32000, bookings: 26 },
  { month: 'Apr', revenue: 35000, bookings: 28 },
  { month: 'May', revenue: 42000, bookings: 34 },
  { month: 'Jun', revenue: 48500, bookings: 38 },
];

const occupancyData = [
  { property: 'Luxury Lodge', occupancy: 85 },
  { property: 'Treehouse', occupancy: 92 },
  { property: 'Riverside', occupancy: 78 },
  { property: 'Wellness', occupancy: 88 },
  { property: 'Mountain Cabin', occupancy: 65 },
  { property: 'Beach Bungalow', occupancy: 45 },
];

const reports = [
  {
    id: 'RPT001',
    name: 'Monthly Revenue Report',
    type: 'Financial',
    description: 'Summary of all revenue streams and expenses',
    lastGenerated: '2024-02-01',
    frequency: 'Monthly',
  },
  {
    id: 'RPT002',
    name: 'Occupancy Analysis',
    type: 'Operations',
    description: 'Property occupancy rates and booking patterns',
    lastGenerated: '2024-02-05',
    frequency: 'Weekly',
  },
  {
    id: 'RPT003',
    name: 'Guest Satisfaction Survey',
    type: 'Quality',
    description: 'Guest feedback and satisfaction metrics',
    lastGenerated: '2024-02-01',
    frequency: 'Monthly',
  },
  {
    id: 'RPT004',
    name: 'Activity Performance',
    type: 'Operations',
    description: 'Popular activities and attendance rates',
    lastGenerated: '2024-02-03',
    frequency: 'Weekly',
  },
  {
    id: 'RPT005',
    name: 'Staff Performance Review',
    type: 'HR',
    description: 'Guide and staff ratings and performance',
    lastGenerated: '2024-02-01',
    frequency: 'Monthly',
  },
  {
    id: 'RPT006',
    name: 'Marketing Campaign Analysis',
    type: 'Marketing',
    description: 'Booking source and marketing ROI analysis',
    lastGenerated: '2024-02-04',
    frequency: 'Bi-weekly',
  },
];

const typeColors = {
  Financial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  Operations: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  Quality: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  HR: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  Marketing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
};

export function ReportsContent() {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-06-30');

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-2">View key business metrics and generate reports.</p>
      </div>

      {/* Date Range Filter */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Calendar size={18} />
            Apply Filter
          </Button>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Revenue & Bookings Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Occupancy by Property */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Current Occupancy Rates</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="property" stroke="var(--color-muted-foreground)" angle={-45} height={80} />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: `1px solid var(--color-border)`,
                  borderRadius: '0.5rem',
                }}
              />
              <Bar dataKey="occupancy" fill="var(--color-secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Available Reports */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{report.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{report.id}</p>
                </div>
              </div>

              <p className="text-sm text-foreground mb-4 flex-1">{report.description}</p>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      typeColors[report.type as keyof typeof typeColors]
                    }`}
                  >
                    {report.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="font-medium text-foreground">{report.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Generated:</span>
                  <span className="font-medium text-foreground">{report.lastGenerated}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                <Download size={16} />
                Generate Report
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
