'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Star, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockReviews = [
  {
    id: 'REV001',
    guest: 'Sarah Johnson',
    property: 'Luxury Safari Lodge',
    rating: 5,
    title: 'Unforgettable Experience!',
    comment:
      'Absolutely amazing stay! The guides were knowledgeable, the food was delicious, and the views were breathtaking. Highly recommend!',
    date: '2024-02-15',
    status: 'published',
    helpful: 45,
  },
  {
    id: 'REV002',
    guest: 'Michael Chen',
    property: 'Treehouse Retreat',
    rating: 4,
    title: 'Great Experience with Minor Issues',
    comment: 'Loved the unique accommodation and location. Only minor complaints about the water pressure in the shower.',
    date: '2024-02-18',
    status: 'published',
    helpful: 23,
  },
  {
    id: 'REV003',
    guest: 'Emma Williams',
    property: 'Riverside Camp',
    rating: 5,
    title: 'Perfect Getaway',
    comment:
      'The staff was incredibly friendly and attentive. The activities were well-organized and the wildlife viewing was spectacular.',
    date: '2024-02-22',
    status: 'published',
    helpful: 67,
  },
  {
    id: 'REV004',
    guest: 'James Brown',
    property: 'Luxury Safari Lodge',
    rating: 4,
    title: 'Worth the Price',
    comment: 'Excellent accommodation and service. Food options could be more diverse but overall very satisfied.',
    date: '2024-02-25',
    status: 'published',
    helpful: 34,
  },
  {
    id: 'REV005',
    guest: 'Lisa Anderson',
    property: 'Wellness Retreat',
    rating: 3,
    title: 'Good but Not Great',
    comment:
      'Nice facilities but felt a bit overcrowded during our stay. The yoga classes were great though.',
    date: '2024-03-01',
    status: 'pending',
    helpful: 12,
  },
  {
    id: 'REV006',
    guest: 'David Martinez',
    property: 'Mountain View Cabin',
    rating: 2,
    title: 'Disappointed with Service',
    comment: 'The cabin was nice but the service was lacking and we had some maintenance issues.',
    date: '2024-03-02',
    status: 'pending',
    helpful: 8,
  },
];

const statusColors = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  reported: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

export function ReviewsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredReviews = mockReviews.filter((review) => {
    const matchesSearch =
      review.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const averageRating =
    mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Guest Reviews</h1>
        <p className="text-muted-foreground mt-2">Manage and moderate guest feedback.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={cn(
                    'transition-colors',
                    i < Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Reviews</p>
          <p className="text-3xl font-bold text-foreground mt-2">{mockReviews.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pending Review</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {mockReviews.filter((r) => r.status === 'pending').length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by guest, property or review title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['published', 'pending'].map((status) => (
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

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-foreground">{review.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[review.status as keyof typeof statusColors]}`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{review.guest}</span>
                  <span>•</span>
                  <span>{review.property}</span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
              </div>
              <button className="p-2 hover:bg-border rounded-lg transition-colors">
                <MoreHorizontal size={18} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={cn(
                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                  )}
                />
              ))}
            </div>

            <p className="text-foreground mb-4">{review.comment}</p>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{review.helpful} people found this helpful</span>
              {review.status === 'pending' && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Approve
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 bg-transparent">
                    <Trash2 size={16} />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
