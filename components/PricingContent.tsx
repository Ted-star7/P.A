'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

const mockPricingTiers = [
  {
    id: 'PRICE001',
    type: 'Luxury Safari Lodge',
    season: 'High Season',
    pricePerNight: '$450',
    minStay: 2,
    maxGuests: 8,
    capacity: '8 persons',
    discount: 'No',
    description: 'Premium all-inclusive experience',
    currency: 'USD',
    active: true,
    occupancy: 'High',
  },
  {
    id: 'PRICE002',
    type: 'Luxury Safari Lodge',
    season: 'Low Season',
    pricePerNight: '$320',
    minStay: 2,
    maxGuests: 8,
    capacity: '8 persons',
    discount: '20% off high season',
    description: 'Premium all-inclusive experience',
    currency: 'USD',
    active: true,
    occupancy: 'Medium',
  },
  {
    id: 'PRICE003',
    type: 'Treehouse Retreat',
    season: 'Year Round',
    pricePerNight: '$380',
    minStay: 1,
    maxGuests: 4,
    capacity: '4 persons',
    discount: 'No',
    description: 'Elevated nature experience',
    currency: 'USD',
    active: true,
    occupancy: 'High',
  },
  {
    id: 'PRICE004',
    type: 'Riverside Camp',
    season: 'High Season',
    pricePerNight: '$320',
    minStay: 2,
    maxGuests: 6,
    capacity: '6 persons',
    discount: 'No',
    description: 'Glamping with modern comfort',
    currency: 'USD',
    active: true,
    occupancy: 'Medium',
  },
  {
    id: 'PRICE005',
    type: 'Riverside Camp',
    season: 'Low Season',
    pricePerNight: '$240',
    minStay: 2,
    maxGuests: 6,
    capacity: '6 persons',
    discount: '25% off high season',
    description: 'Glamping with modern comfort',
    currency: 'USD',
    active: true,
    occupancy: 'Low',
  },
  {
    id: 'PRICE006',
    type: 'Wellness Retreat',
    season: 'Year Round',
    pricePerNight: '$520',
    minStay: 3,
    maxGuests: 12,
    capacity: '12 persons',
    discount: 'Group discounts available',
    description: 'Spa & wellness focused',
    currency: 'USD',
    active: true,
    occupancy: 'High',
  },
];

const activityPrices = [
  {
    id: 'ACT_P001',
    name: 'Sunrise Safari',
    price: '$120',
    perUnit: 'per person',
    minParticipants: 2,
    active: true,
  },
  {
    id: 'ACT_P002',
    name: 'Bird Watching Tour',
    price: '$95',
    perUnit: 'per person',
    minParticipants: 3,
    active: true,
  },
  {
    id: 'ACT_P003',
    name: 'Night Game Drive',
    price: '$150',
    perUnit: 'per person',
    minParticipants: 2,
    active: true,
  },
  {
    id: 'ACT_P004',
    name: 'Guided Nature Walk',
    price: '$75',
    perUnit: 'per person',
    minParticipants: 2,
    active: true,
  },
];

export function PricingContent() {
  const [activeTab, setActiveTab] = useState<'accommodations' | 'activities'>('accommodations');

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pricing Management</h1>
          <p className="text-muted-foreground mt-2">Configure prices for accommodations and activities.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={20} />
          Add Pricing Tier
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('accommodations')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'accommodations'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Accommodations
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'activities'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Activities
        </button>
      </div>

      {/* Accommodations Pricing */}
      {activeTab === 'accommodations' && (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Property</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Season</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price/Night</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Min Stay</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Capacity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Discount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPricingTiers.map((tier) => (
                    <tr key={tier.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{tier.type}</p>
                          <p className="text-xs text-muted-foreground">{tier.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{tier.season}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{tier.pricePerNight}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{tier.minStay} nights</td>
                      <td className="px-6 py-4 text-sm text-foreground">{tier.capacity}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{tier.discount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded text-xs font-medium">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-2 hover:bg-border rounded-lg transition-colors">
                            <Edit2 size={16} className="text-muted-foreground" />
                          </button>
                          <button className="p-2 hover:bg-border rounded-lg transition-colors">
                            <Trash2 size={16} className="text-destructive" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Activities Pricing */}
      {activeTab === 'activities' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activityPrices.map((activity) => (
              <Card key={activity.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">{activity.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{activity.id}</p>
                  </div>
                  <button className="p-2 hover:bg-border rounded-lg transition-colors">
                    <MoreHorizontal size={18} className="text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="text-2xl font-bold text-primary">{activity.price}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.perUnit}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min Participants:</span>
                      <span className="font-medium text-foreground">{activity.minParticipants}</span>
                    </div>
                  </div>

                  <div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded text-xs font-medium">
                      {activity.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                      <Edit2 size={16} />
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
