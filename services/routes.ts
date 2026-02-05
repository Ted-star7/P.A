// Route configuration for Pergola Africa Admin Portal
export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Protected routes
  DASHBOARD: '/',
  BOOKINGS: '/bookings',
  ACTIVITIES: '/activities',
  ACCOMMODATIONS: '/accommodations',
  PRICING: '/pricing',
  GUIDES: '/guides',
  PAYMENTS: '/payments',
  REVIEWS: '/reviews',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
} as const;

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.RESET_PASSWORD,
  ROUTES.VERIFY_EMAIL,
];

// Protected routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.BOOKINGS,
  ROUTES.ACTIVITIES,
  ROUTES.ACCOMMODATIONS,
  ROUTES.PRICING,
  ROUTES.GUIDES,
  ROUTES.PAYMENTS,
  ROUTES.REVIEWS,
  ROUTES.REPORTS,
  ROUTES.NOTIFICATIONS,
  ROUTES.SETTINGS,
];
