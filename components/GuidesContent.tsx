'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, MoreHorizontal, Mail, Phone, Award } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockGuides = [
  {
    id: 'GUIDE001',
    name: 'David Kipchoge',
    email: 'david@pergolafrica.com',
    phone: '+254 712 345 678',
    specialization: 'Safari & Wildlife',
    experience: '12 years',
    certifications: ['Guide License', 'First Aid', 'Safety'],
    languages: ['English', 'Swahili', 'French'],
    activeActivities: 2,
    rating: 4.9,
    reviews: 156,
    status: 'active',
    joinDate: '2012-03-15',
  },
  {
    id: 'GUIDE002',
    name: 'Jane Kamau',
    email: 'jane@pergolafrica.com',
    phone: '+254 712 345 679',
    specialization: 'Bird Watching & Nature',
    experience: '10 years',
    certifications: ['Ornithology Certificate', 'Guide License', 'Photography'],
    languages: ['English', 'Swahili'],
    activeActivities: 1,
    rating: 4.8,
    reviews: 124,
    status: 'active',
    joinDate: '2014-06-20',
  },
  {
    id: 'GUIDE003',
    name: 'Robert Okonkwo',
    email: 'robert@pergolafrica.com',
    phone: '+254 712 345 680',
    specialization: 'Night Safari & Tracking',
    experience: '15 years',
    certifications: ['Tracking Expert', 'Guide License', 'Adventure Safety'],
    languages: ['English', 'Swahili', 'Kikuyu'],
    activeActivities: 1,
    rating: 4.7,
    reviews: 98,
    status: 'active',
    joinDate: '2009-01-10',
  },
  {
    id: 'GUIDE004',
    name: 'Mary Wanjiru',
    email: 'mary@pergolafrica.com',
    phone: '+254 712 345 681',
    specialization: 'Guided Walks & Ecology',
    experience: '8 years',
    certifications: ['Ecology Degree', 'Guide License', 'Wilderness First Aid'],
    languages: ['English', 'Swahili'],
    activeActivities: 1,
    rating: 4.6,
    reviews: 87,
    status: 'active',
    joinDate: '2016-05-12',
  },
  {
    id: 'GUIDE005',
    name: 'Alex Kipchoge',
    email: 'alex@pergolafrica.com',
    phone: '+254 712 345 682',
    specialization: 'Adventure Sports & Climbing',
    experience: '7 years',
    certifications: ['Climbing Instructor', 'Rope Access', 'Guide License'],
    languages: ['English', 'Swahili'],
    activeActivities: 1,
    rating: 4.5,
    reviews: 76,
    status: 'active',
    joinDate: '2017-08-22',
  },
  {
    id: 'GUIDE006',
    name: 'Sarah Kipchoge',
    email: 'sarah@pergolafrica.com',
    phone: '+254 712 345 683',
    specialization: 'Wellness & Yoga',
    experience: '6 years',
    certifications: ['Yoga Instructor', 'Wellness Coach', 'Meditation'],
    languages: ['English', 'Swahili', 'Spanish'],
    activeActivities: 1,
    rating: 4.8,
    reviews: 112,
    status: 'active',
    joinDate: '2018-02-14',
  },
];

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  onLeave: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
};

export function GuidesContent() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuides = mockGuides.filter((guide) =>
    guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Guides & Staff</h1>
          <p className="text-muted-foreground mt-2">Manage tour guides and activity leaders.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={20} />
          Add Guide
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, ID, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </Card>

      {/* Summary */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredGuides.length} of {mockGuides.length} guides
      </p>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{guide.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{guide.id}</p>
              </div>
              <button className="p-2 hover:bg-border rounded-lg transition-colors flex-shrink-0">
                <MoreHorizontal size={18} className="text-muted-foreground" />
              </button>
            </div>

            {/* Specialization */}
            <div className="mb-4">
              <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                {guide.specialization}
              </span>
            </div>

            {/* Contact & Experience */}
            <div className="space-y-3 mb-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} />
                <span className="truncate">{guide.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={16} />
                <span>{guide.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                <Award size={16} className="text-accent" />
                <span>{guide.experience} experience</span>
              </div>
            </div>

            {/* Languages */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Languages:</p>
              <div className="flex flex-wrap gap-1">
                {guide.languages.map((lang) => (
                  <span key={lang} className="px-2 py-1 bg-muted text-foreground text-xs rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Certifications:</p>
              <div className="flex flex-wrap gap-1">
                {guide.certifications.map((cert) => (
                  <span key={cert} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Rating and Activities */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating:</span>
                <span className="font-semibold text-foreground">
                  {guide.rating} / 5 ({guide.reviews} reviews)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Activities:</span>
                <span className="font-semibold text-foreground">{guide.activeActivities}</span>
              </div>
            </div>

            {/* Status */}
            <span
              className={`inline-block px-3 py-1 rounded text-xs font-medium w-fit ${
                statusColors[guide.status as keyof typeof statusColors]
              }`}
            >
              {guide.status.charAt(0).toUpperCase() + guide.status.slice(1)}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
