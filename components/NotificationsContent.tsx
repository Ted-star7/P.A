'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Info, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

const mockNotifications = [
  {
    id: 'NOTIF001',
    type: 'booking',
    title: 'New Booking Received',
    message: 'Sarah Johnson has booked Luxury Safari Lodge for Feb 15-20',
    timestamp: '2 hours ago',
    read: false,
    icon: CheckCircle,
  },
  {
    id: 'NOTIF002',
    type: 'payment',
    title: 'Payment Pending',
    message: 'Payment from Michael Chen for booking BK002 is awaiting confirmation',
    timestamp: '4 hours ago',
    read: false,
    icon: AlertCircle,
  },
  {
    id: 'NOTIF003',
    type: 'activity',
    title: 'Activity Approaching Capacity',
    message: 'Sunrise Safari on Feb 15 is 85% booked (10/12 spots remaining)',
    timestamp: '6 hours ago',
    read: true,
    icon: Info,
  },
  {
    id: 'NOTIF004',
    type: 'system',
    title: 'Maintenance Scheduled',
    message: 'Beach Bungalow maintenance scheduled for Feb 28-Mar 2',
    timestamp: '1 day ago',
    read: true,
    icon: Settings,
  },
  {
    id: 'NOTIF005',
    type: 'review',
    title: 'New Review Submitted',
    message: 'Lisa Anderson left a 3-star review for Wellness Retreat',
    timestamp: '2 days ago',
    read: true,
    icon: Info,
  },
  {
    id: 'NOTIF006',
    type: 'booking',
    title: 'Booking Cancelled',
    message: 'David Martinez cancelled booking BK006 for Mountain View Cabin',
    timestamp: '3 days ago',
    read: true,
    icon: AlertCircle,
  },
];

const typeColors = {
  booking: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
  payment: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900',
  activity: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
  system: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
  review: 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900',
};

export function NotificationsContent() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-2">Stay updated with important resort alerts.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <Card className="p-4 bg-accent/10 border-accent/20">
          <p className="text-accent font-medium">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </Card>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            filter === 'unread'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Unread {unreadCount > 0 && <span className="ml-2 bg-accent text-accent-foreground rounded-full px-2 py-0.5 text-xs font-bold">{unreadCount}</span>}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <Card
                key={notif.id}
                className={`p-6 transition-all ${
                  notif.read
                    ? 'opacity-75 hover:opacity-100'
                    : 'border-l-4 border-l-accent bg-accent/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${typeColors[notif.type]}`}>
                    <Icon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{notif.title}</h3>
                        <p className="text-sm text-foreground mt-1">{notif.message}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-3 h-3 rounded-full bg-accent flex-shrink-0 mt-2" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{notif.timestamp}</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="p-2 hover:bg-border rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        title="Mark as read"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-2 hover:bg-border rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No notifications to display</p>
          </Card>
        )}
      </div>
    </div>
  );
}
