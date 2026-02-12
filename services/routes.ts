export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // Protected routes
  DASHBOARD: '/',
  BOOKINGS: '/bookings',
  DIRECT_BOOKINGS: '/bookings/direct',
  WALKIN_BOOKINGS: '/bookings/walk-in',
  ACTIVITIES: '/activities',
  ACCOMMODATIONS: '/accommodations',
  GUIDES: '/guides',
  REVIEWS: '/reviews',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
} as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_EMAIL,
];

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.BOOKINGS,
  ROUTES.DIRECT_BOOKINGS,
  ROUTES.WALKIN_BOOKINGS,
  ROUTES.ACTIVITIES,
  ROUTES.ACCOMMODATIONS,
  ROUTES.GUIDES,
  ROUTES.REVIEWS,
  ROUTES.REPORTS,
  ROUTES.NOTIFICATIONS,
  ROUTES.SETTINGS,
];