// models/types.ts

// ── Enums & Constants ─────────────────────────────────────────────────────────

export const TRAVEL_MODES = ['flying', 'driving', 'train', 'bus', 'other'] as const;
export type TravelMode = typeof TRAVEL_MODES[number];

export const MEMBER_ROLES = ['owner', 'member'] as const;
export type MemberRole = typeof MEMBER_ROLES[number];

export const ACTIVITY_ACTIONS = ['member_added', 'member_removed', 'member_restored', 'member_left'] as const;
export type ActivityAction = typeof ACTIVITY_ACTIONS[number];

// Type guards
export function isValidTravelMode(value: string): value is TravelMode {
  return (TRAVEL_MODES as readonly string[]).includes(value);
}

export function isValidMemberRole(value: string): value is MemberRole {
  return (MEMBER_ROLES as readonly string[]).includes(value);
}

export function isValidActivityAction(value: string): value is ActivityAction {
  return (ACTIVITY_ACTIONS as readonly string[]).includes(value);
}

// ── User (global) ─────────────────────────────────────────────────────────────

export interface UserDoc {
  displayName: string;
  username: string;
  email: string;
  avatarEmoji: string;
  color: string;
  createdAt: number;
}

// ── Trip ──────────────────────────────────────────────────────────────────────

export interface TripDoc {
  name: string;
  destination: string;
  destinationPlaceId: string;
  destinationCoords: { lat: number; lng: number };
  startDate: string;
  endDate: string;
  currency: string;
  coverPhotoUrl?: string;
  createdBy: string;
  createdAt: number;
  memberCount: number;
}

// ── Trip Member ──────────────────────────────────────────────────────────────

export interface TripMemberDoc {
  role: MemberRole;
  displayName: string;
  avatarEmoji: string;
  color: string;
  joinedAt: number;
  travelMode?: TravelMode | null;
  arrivalDate?: string;
  arrivalTime?: string;
  departureDate?: string;
  departureTime?: string;
  hiddenPages?: string[];
}

// ── Invite ───────────────────────────────────────────────────────────────────

export interface InviteDoc {
  code: string;
  createdBy: string;
  createdAt: number;
  expiresAt: number;
  usedBy: string[];
}

export interface InviteIndexDoc {
  tripId: string;
  expiresAt: number;
}

// ── Activity Log ─────────────────────────────────────────────────────────────

export interface ActivityLogDoc {
  action: ActivityAction;
  targetUid: string;
  performedByUid: string;
  timestamp: number;
}

// ── Travel ───────────────────────────────────────────────────────────────────

export interface TravelDoc {
  uid: string;
  addedByUid: string;
  mode: TravelMode;
  direction: 'arrival' | 'departure';
  createdAt: number;

  // Flying
  airline?: string;
  flightNumber?: string;
  from?: string;
  to?: string;

  // Driving
  origin?: string;
  estimatedDuration?: string;

  // Train/Bus
  carrier?: string;
  departureStation?: string;
  arrivalStation?: string;

  // Common
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  notes: string;
}

// ── User Trips Index ─────────────────────────────────────────────────────────

export interface UserTripsDoc {
  tripIds: string[];
  lastActiveTrip: string;
}

// ── Content Sub-Collections ──────────────────────────────────────────────────

export interface ItineraryItemDoc {
  id: string;
  date: string;
  time: string;
  endTime: string;
  activity: string;
  location: string;
  category: string;
  notes: string;
  forWho: string;
  addedByUid: string;
  sortOrder: number;
  createdAt: number;
}

export interface FinanceEntryDoc {
  id: string;
  date: string;
  vendor?: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  splitAmong: string;
  splits?: Record<string, number>;
  category: string;
  notes?: string;
  link?: string;
  addedByUid: string;
  createdAt: number;
}

export interface AccommodationDoc {
  id: string;
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
  notes: string;
  bookingRef: string;
  link?: string;
  forWho: string;
  addedByUid: string;
  createdAt: number;
}

export interface RecDoc {
  id: string;
  category: string;
  title: string;
  description: string;
  extra: string;
  addedByUid: string;
  createdAt: number;
}

export interface MapPinDoc {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  notes?: string;
  addedBy: string;
  forWho: string;
}

export interface OutfitEntryDoc {
  date: string;
  user: string;
  items: string[];
  photoUrl?: string;
  notes?: string;
}

export interface PackingItemDoc {
  id: string;
  label: string;
  packed: boolean;
  addedAt: number;
  category?: string;
}

export interface RentalCarDoc {
  id: string;
  company: string;
  confirmationNumber: string;
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  dropoffDate: string;
  dropoffTime: string;
  dropoffLocation: string;
  drivers: string;
  notes: string;
  platform?: string;
  link?: string;
  rentalName?: string;
  passengers?: string;
  location?: string;
}
