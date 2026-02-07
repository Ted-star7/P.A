'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, MoreHorizontal, Users, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

const mockActivities = [
  {
    id: 'ACT001',
    name: 'Sunrise Safari',
    description: 'Early morning game drive to spot wildlife at their most active',
    location: 'Northern Reserve',
    duration: '3 hours',
    schedule: 'Daily 6:00 AM',
    maxGuests: 12,
    currentGuests: 8,
    guide: 'David Kipchoge',
    price: '$120 per person',
    status: 'active',
    difficulty: 'Easy',
  },
  {
    id: 'ACT002',
    name: 'Bird Watching Tour',
    description: 'Guided tour for bird enthusiasts with expert identification',
    location: 'Wetlands Area',
    duration: '4 hours',
    schedule: 'Wed & Fri 8:00 AM',
    maxGuests: 10,
    currentGuests: 6,
    guide: 'Jane Kamau',
    price: '$95 per person',
    status: 'active',
    difficulty: 'Moderate',
  },
  {
    id: 'ACT003',
    name: 'Night Game Drive',
    description: 'Experience nocturnal wildlife with night vision equipment',
    location: 'Central Reserve',
    duration: '2.5 hours',
    schedule: 'Daily 6:30 PM',
    maxGuests: 15,
    currentGuests: 14,
    guide: 'Robert Okonkwo',
    price: '$150 per person',
    status: 'active',
    difficulty: 'Easy',
  },
  {
    id: 'ACT004',
    name: 'Guided Nature Walk',
    description: 'Slow-paced walking tour to explore flora and fauna up close',
    location: 'Forest Trails',
    duration: '2 hours',
    schedule: 'Tue, Thu & Sat 9:00 AM',
    maxGuests: 8,
    currentGuests: 5,
    guide: 'Mary Wanjiru',
    price: '$75 per person',
    status: 'active',
    difficulty: 'Easy',
  },
  {
    id: 'ACT005',
    name: 'Rock Climbing & Rappelling',
    description: 'Adventure activity on our private rock formations',
    location: 'Rock Ridge',
    duration: '4 hours',
    schedule: 'Mon & Sat 10:00 AM',
    maxGuests: 6,
    currentGuests: 4,
    guide: 'Alex Kipchoge',
    price: '$180 per person',
    status: 'active',
    difficulty: 'Hard',
  },
  {
    id: 'ACT006',
    name: 'Yoga & Meditation',
    description: 'Relaxing wellness session in nature',
    location: 'Yoga Pavilion',
    duration: '1.5 hours',
    schedule: 'Daily 6:00 AM & 5:30 PM',
    maxGuests: 20,
    currentGuests: 18,
    guide: 'Sarah Kipchoge',
    price: '$50 per person',
    status: 'seasonal',
    difficulty: 'Easy',
  },
];

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  Moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  Hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

const statusColors = {
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  seasonal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
};

export function ActivitiesContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = mockActivities.filter((activity) =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activities</h1>
          <p className="text-muted-foreground mt-2">Manage resort activities and tours.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={20} />
          New Activity
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search activities by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Summary */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredActivities.length} of {mockActivities.length} activities
      </p>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{activity.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{activity.id}</p>
              </div>
              <button className="p-2 hover:bg-border rounded-lg transition-colors shrink-0">
                <MoreHorizontal size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-foreground mb-4 line-clamp-2">{activity.description}</p>

            {/* Meta information */}
            <div className="space-y-3 mb-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} />
                <span>{activity.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} />
                <span>{activity.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users size={16} />
                <span>{activity.currentGuests}/{activity.maxGuests} guests</span>
              </div>
            </div>

            {/* Occupancy bar */}
            <div className="mb-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(activity.currentGuests / activity.maxGuests) * 100}%` }}
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guide:</span>
                <span className="text-foreground font-medium">{activity.guide}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="text-foreground font-medium">{activity.price}</span>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex gap-2 flex-wrap">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  statusColors[activity.status as keyof typeof statusColors]
                }`}
              >
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </span>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  difficultyColors[activity.difficulty as keyof typeof difficultyColors]
                }`}
              >
                {activity.difficulty}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
