"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  Tent,
  Waves,
  Mountain,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  MapPin,
  Sun,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";
import { useEffect, useState } from "react";

// Updated stats
const dashboardStats = [
  {
    label: "Total Bookings",
    value: "342",
    change: "+12%",
    trend: "up",
    icon: Calendar,
    color: "bg-[#7A0F14]",
    href: "/bookings",
  },
  {
    label: "Active Campers",
    value: "156",
    change: "+8%",
    trend: "up",
    icon: Users,
    color: "bg-[#F26A2E]",
    href: "/bookings",
  },
  {
    label: "Activities Today",
    value: "4",
    change: "2 running",
    trend: "up",
    icon: Waves,
    color: "bg-[#2F5E3F]",
    href: "/activities",
  },
  {
    label: "Available Tents",
    value: "19",
    change: "34 total",
    trend: "up",
    icon: Tent,
    color: "bg-[#4A2C2A]",
    href: "/accommodations",
  },
];

// Activity popularity data - NEW COLOR PALETTE
const activityPopularityData = [
  { name: "Simple Rafting", bookings: 45, color: "#3B82F6" }, // Blue
  { name: "River Swimming", bookings: 38, color: "#8B5CF6" }, // Purple
  { name: "Guided Hiking", bookings: 27, color: "#EC4899" }, // Pink
  { name: "Fishing", bookings: 15, color: "#14B8A6" }, // Teal
];

// Booking source data - NEW COLOR PALETTE
const bookingSourceData = [
  { name: "Direct Call/WhatsApp", value: 55, fill: "#F59E0B" }, // Amber
  { name: "Walk-In", value: 25, fill: "#10B981" }, // Emerald
  { name: "Travel Agency", value: 12, fill: "#6366F1" }, // Indigo
  { name: "Referrals", value: 8, fill: "#EF4444" }, // Red
];

// Recent bookings
const recentBookings = [
  {
    id: 1,
    guest: "Sarah Johnson",
    accommodation: "Dome Plus Tent",
    checkIn: "2024-02-15",
    status: "Confirmed",
    pax: 4,
  },
  {
    id: 2,
    guest: "Michael Chen",
    accommodation: "Cabin Style Tent",
    checkIn: "2024-02-18",
    status: "Pending",
    pax: 2,
  },
  {
    id: 3,
    guest: "Emma Williams",
    accommodation: "Own Tent",
    checkIn: "2024-02-22",
    status: "Confirmed",
    pax: 3,
  },
  {
    id: 4,
    guest: "James Brown",
    accommodation: "Dome Tent",
    checkIn: "2024-02-25",
    status: "Confirmed",
    pax: 5,
  },
  {
    id: 5,
    guest: "Lisa Anderson",
    accommodation: "Cabin Style Tent",
    checkIn: "2024-03-01",
    status: "Pending",
    pax: 4,
  },
];

// Today's activities
const todaysActivities = [
  {
    id: 1,
    name: "Simple Rafting",
    time: "10:00 AM",
    guide: "David Kipchoge",
    slots: 12,
    booked: 8,
  },
  {
    id: 2,
    name: "River Swimming",
    time: "2:00 PM",
    guide: "Jane Kamau",
    slots: 15,
    booked: 10,
  },
  {
    id: 3,
    name: "Guided Hiking",
    time: "6:30 AM",
    guide: "Robert Okonkwo",
    slots: 10,
    booked: 7,
  },
  {
    id: 4,
    name: "Fishing",
    time: "8:00 AM",
    guide: "Mary Wanjiru",
    slots: 8,
    booked: 4,
  },
];

// Tent types
const tentTypes = [
  { name: "Dome Plus", total: 12, rate: "KSh 3,000", icon: Tent },
  { name: "Cabin Style", total: 8, rate: "KSh 3,000", icon: Tent },
  { name: "Dome Tent", total: 15, rate: "KSh 1,500/pax", icon: Tent },
  { name: "Own Tent", total: 20, rate: "KSh 1,000/pax", icon: Tent },
];

export function DashboardContent() {
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <div className="space-y-8 p-8 bg-white min-h-screen">
      {/* Header with dynamic greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#4A2C2A]">{greeting}, 👋</h1>
          <div className="flex items-center gap-2 mt-2">
            <MapPin size={16} className="text-[#F26A2E]" />
            <p className="text-[#4A2C2A]/60">
              Pergola Africa · Sagana, Central Kenya
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/bookings/new">
            <Button className="bg-[#7A0F14] hover:bg-[#7A0F14]/90 text-white">
              <Calendar size={16} className="mr-2" />
              New Booking
            </Button>
          </Link>
          <div className="flex items-center gap-2 bg-[#F5F1EA] px-4 py-2 rounded-lg">
            <Sun size={18} className="text-[#F26A2E]" />
            <span className="text-sm font-medium text-[#4A2C2A]">
              24°C · Sagana
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid - All clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownLeft;
          const trendColor =
            stat.trend === "up" ? "text-[#2F5E3F]" : "text-[#7A0F14]";

          return (
            <Link href={stat.href} key={index}>
              <Card className="p-6 bg-white border border-[#4A2C2A]/10 hover:border-[#F26A2E]/30 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[#4A2C2A]/60 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-[#4A2C2A] mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  <TrendIcon size={16} className={trendColor} />
                  <span className={`text-sm font-medium ${trendColor}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-[#4A2C2A]/40 ml-1">
                    vs yesterday
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Popularity - New colors */}
        <Card className="lg:col-span-2 p-6 bg-white border border-[#4A2C2A]/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#4A2C2A]">
              Popular Activities
            </h2>
            <Link href="/activities">
              <Button
                variant="outline"
                size="sm"
                className="border-[#F26A2E] text-[#F26A2E] hover:bg-[#F26A2E] hover:text-white"
              >
                <Eye size={14} className="mr-2" />
                View All
              </Button>
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityPopularityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" stroke="#6B7280" />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#6B7280"
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#1F2937", fontWeight: 600 }}
              />
              <Bar dataKey="bookings" radius={[0, 4, 4, 0]}>
                {activityPopularityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Booking Sources - New colors */}
        <Card className="p-6 bg-white border border-[#4A2C2A]/10">
          <h2 className="text-lg font-bold text-[#4A2C2A] mb-6">
            How Guests Book
          </h2>
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
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {bookingSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {bookingSourceData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-xs text-[#4A2C2A]/60">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tent Types - Quick Reference */}
      <Card className="p-6 bg-white border border-[#4A2C2A]/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#4A2C2A]">
            Accommodation Options
          </h2>
          <Link href="/accommodations">
            <Button
              variant="outline"
              size="sm"
              className="border-[#F26A2E] text-[#F26A2E] hover:bg-[#F26A2E] hover:text-white"
            >
              <ExternalLink size={14} className="mr-2" />
              Manage Rates
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tentTypes.map((tent, index) => (
            <div
              key={index}
              className="p-4 bg-[#F5F1EA] rounded-lg hover:bg-[#F5F1EA]/80 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white rounded-lg">
                  <tent.icon size={18} className="text-[#F26A2E]" />
                </div>
                <h3 className="font-semibold text-[#4A2C2A]">{tent.name}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A2C2A]/60">Total units</span>
                  <span className="font-medium text-[#4A2C2A]">
                    {tent.total}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#4A2C2A]/60">Rate</span>
                  <span className="font-medium text-[#7A0F14]">
                    {tent.rate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="p-6 bg-white border border-[#4A2C2A]/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#4A2C2A]">
              Recent Bookings
            </h2>
            <Link href="/bookings">
              <Button
                variant="outline"
                size="sm"
                className="border-[#F26A2E] text-[#F26A2E] hover:bg-[#F26A2E] hover:text-white"
              >
                <Eye size={14} className="mr-2" />
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {recentBookings.map((booking) => (
              <Link href={`/bookings/${booking.id}`} key={booking.id}>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F5F1EA] transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#4A2C2A]">
                        {booking.guest}
                      </p>
                      <span className="text-xs bg-white px-2 py-0.5 rounded-full text-[#4A2C2A] border border-[#4A2C2A]/10">
                        {booking.pax} pax
                      </span>
                    </div>
                    <p className="text-sm text-[#4A2C2A]/60">
                      {booking.accommodation}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === "Confirmed"
                        ? "bg-[#2F5E3F]/10 text-[#2F5E3F]"
                        : "bg-[#F26A2E]/10 text-[#F26A2E]"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Today's Activities */}
        <Card className="p-6 bg-white border border-[#4A2C2A]/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#4A2C2A]">
              Today's Activities
            </h2>
            <Link href="/activities">
              <Button
                variant="outline"
                size="sm"
                className="border-[#F26A2E] text-[#F26A2E] hover:bg-[#F26A2E] hover:text-white"
              >
                <Eye size={14} className="mr-2" />
                Schedule
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            {todaysActivities.map((activity) => (
              <Link href={`/activities/${activity.id}`} key={activity.id}>
                <div className="p-3 rounded-lg hover:bg-[#F5F1EA] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[#4A2C2A]">
                          {activity.name}
                        </p>
                        <span className="text-xs bg-white px-2 py-0.5 rounded-full text-[#4A2C2A] border border-[#4A2C2A]/10">
                          <Clock size={10} className="inline mr-1" />
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-[#4A2C2A]/60">
                        Guide: {activity.guide}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium bg-[#7A0F14]/10 text-[#7A0F14] px-3 py-1 rounded-full">
                        {activity.booked}/{activity.slots}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 w-full h-1.5 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2F5E3F] rounded-full"
                      style={{
                        width: `${(activity.booked / activity.slots) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}