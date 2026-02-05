'use client';

import React from "react"

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Bell, Lock, Users, DollarSign, Globe, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'users' | 'payments'>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    resortName: 'Pergola Africa',
    email: 'admin@pergolafrica.com',
    phone: '+254 712 345 600',
    location: 'Kenya, East Africa',
    timezone: 'Africa/Nairobi',
    currency: 'USD',
    language: 'English',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    bookingAlerts: true,
    paymentAlerts: true,
    reviewNotifications: true,
    systemUpdates: false,
    weeklyReport: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure resort settings and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {[
          { id: 'general', label: 'General', icon: Globe },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'users', label: 'Users & Permissions', icon: Users },
          { id: 'payments', label: 'Payments', icon: DollarSign },
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <TabIcon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Resort Information</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Resort Name</label>
                  <input
                    type="text"
                    name="resortName"
                    value={formData.resortName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Africa/Nairobi</option>
                    <option>Africa/Lagos</option>
                    <option>Africa/Cairo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>KES</option>
                    <option>GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>English</option>
                    <option>French</option>
                    <option>Swahili</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save size={18} />
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button variant="outline">Change Password</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Notification Preferences</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Alert Types</h3>
              <div className="space-y-4">
                {[
                  { key: 'bookingAlerts', label: 'Booking Notifications', desc: 'Get notified when new bookings arrive' },
                  { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Receive updates on payment status' },
                  { key: 'reviewNotifications', label: 'Review Notifications', desc: 'Be notified of new guest reviews' },
                  { key: 'systemUpdates', label: 'System Updates', desc: 'Receive system maintenance alerts' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Get a weekly summary report' },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings[key as keyof typeof notificationSettings]}
                      onChange={() => handleNotificationChange(key)}
                      className="w-5 h-5 accent-primary rounded"
                    />
                    <div>
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4">Notification Channels</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive critical alerts via SMS' },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings[key as keyof typeof notificationSettings]}
                      onChange={() => handleNotificationChange(key)}
                      className="w-5 h-5 accent-primary rounded"
                    />
                    <div>
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save size={18} />
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Users & Permissions */}
      {activeTab === 'users' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Team Members</h2>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Add User
            </Button>
          </div>
          <p className="text-muted-foreground">Manage user access and permissions for your team members.</p>
        </Card>
      )}

      {/* Payments Settings */}
      {activeTab === 'payments' && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Payment Configuration</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Payment Gateway</label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Stripe</option>
                <option>PayPal</option>
                <option>Flutterwave</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Secret Key</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save size={18} />
                Update Payment Settings
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
