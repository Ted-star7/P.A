'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, MoreHorizontal, Users, DollarSign, Star } from 'lucide-react';
import { useState } from 'react';

const mockAccommodations = [
  {
    id: 'ACC001',
    name: 'Luxury Safari Lodge',
    description: 'Premium all-inclusive safari accommodation with premium amenities',
    type: 'Lodge',
    capacity: 8,
    occupancy: 6,
    pricePerNight: '$450',
    amenities: ['WiFi', 'Air Conditioning', 'Hot Water', 'Fireplace', 'Game Room'],
    status: 'occupied',
    rating: 4.8,
    reviews: 124,
    bookings: 28,
  },
  {
    id: 'ACC002',
    name: 'Treehouse Retreat',
    description: 'Unique elevated accommodation surrounded by nature',
    type: 'Treehouse',
    capacity: 4,
    occupancy: 3,
    pricePerNight: '$380',
    amenities: ['WiFi', 'Hot Shower', 'Deck', 'Bird Watching Point'],
    status: 'occupied',
    rating: 4.7,
    reviews: 98,
    bookings: 22,
  },
  {
    id: 'ACC003',
    name: 'Riverside Camp',
    description: 'Traditional glamping experience with modern comfort',
    type: 'Glamping Tent',
    capacity: 6,
    occupancy: 4,
    pricePerNight: '$320',
    amenities: ['WiFi', 'Heating', 'Ensuite Bathroom', 'Deck'],
    status: 'occupied',
    rating: 4.6,
    reviews: 87,
    bookings: 25,
  },
  {
    id: 'ACC004',
    name: 'Wellness Retreat',
    description: 'Spa and wellness focused accommodation',
    type: 'Resort Cottage',
    capacity: 12,
    occupancy: 0,
    pricePerNight: '$520',
    amenities: ['Spa', 'Sauna', 'Yoga Studio', 'Pool', 'WiFi', 'Air Conditioning'],
    status: 'available',
    rating: 4.9,
    reviews: 156,
    bookings: 32,
  },
  {
    id: 'ACC005',
    name: 'Mountain View Cabin',
    description: 'Cozy private cabin with panoramic views',
    type: 'Cabin',
    capacity: 4,
    occupancy: 2,
    pricePerNight: '$280',
    amenities: ['Fireplace', 'Deck', 'Kitchen', 'Hiking Trail Access'],
    status: 'occupied',
    rating: 4.5,
    reviews: 76,
    bookings: 18,
  },
  {
    id: 'ACC006',
    name: 'Beach Bungalow',
    description: 'Waterfront accommodation with beach access',
    type: 'Bungalow',
    capacity: 5,
    occupancy: 0,
    pricePerNight: '$400',
    amenities: ['Beach Access', 'Deck', 'WiFi', 'Outdoor Shower'],
    status: 'maintenance',
    rating: 4.4,
    reviews: 64,
    bookings: 15,
  },
];

const statusColors = {
  occupied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  maintenance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
};

export function AccommodationsContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccommodations = mockAccommodations.filter((accommodation) =>
    accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accommodation.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Accommodations</h1>
          <p className="text-muted-foreground mt-2">Manage all lodging facilities and properties.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={20} />
          New Accommodation
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search accommodations by name or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Summary */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredAccommodations.length} of {mockAccommodations.length} accommodations
      </p>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccommodations.map((accommodation) => (
          <Card key={accommodation.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{accommodation.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{accommodation.id}</p>
              </div>
              <button className="p-2 hover:bg-border rounded-lg transition-colors shrink-0">
                <MoreHorizontal size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Type and description */}
            <div className="mb-4">
              <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded mb-2">
                {accommodation.type}
              </span>
              <p className="text-sm text-foreground line-clamp-2">{accommodation.description}</p>
            </div>

            {/* Occupancy info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={16} />
                  <span>Capacity: {accommodation.occupancy}/{accommodation.capacity}</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${(accommodation.occupancy / accommodation.capacity) * 100}%` }}
                />
              </div>
            </div>

            {/* Price and rating */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price/Night:</span>
                <span className="font-semibold text-foreground">{accommodation.pricePerNight}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{accommodation.rating}</span>
                  <span className="text-xs text-muted-foreground">({accommodation.reviews})</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bookings:</span>
                <span className="font-semibold text-foreground">{accommodation.bookings}</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Amenities:</p>
              <div className="flex flex-wrap gap-1">
                {accommodation.amenities.map((amenity) => (
                  <span key={amenity} className="px-2 py-1 bg-muted text-foreground text-xs rounded">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <span
              className={`inline-block px-3 py-1 rounded text-xs font-medium w-fit ${
                statusColors[accommodation.status as keyof typeof statusColors]
              }`}
            >
              {accommodation.status.charAt(0).toUpperCase() + accommodation.status.slice(1)}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
