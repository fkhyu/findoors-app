export interface Building {
  id: string;
  name: string;
  floorCount: number;
  latitude: number;
  longitude: number;
  address: string;
  imageUrl?: string;
}

export interface Floor {
  id: string;
  number: number;
  building: Building;
}

export interface User {
  id: string;
  name: string;
  email: string;
  permissions: string[];
}

export interface Friend {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  color?: string;
  profilePictureUrl?: string;
  lastSeen?: Date;
  isOnline?: boolean;
}

export interface Room {
  id: string;
  number: string;
  name: string;
  building: Building;
  floor: Floor;
  capacity: number;
  features: string[];
  accessible: boolean;
  tags: string[];
  latitude: number;
  longitude: number;
  imageUrl?: string;
  description?: string;
  lastUpdated?: Date;
}

export interface SearchFilters {
  query?: string;
  nearLocation?: Location;
  maxDistance?: number;
  onlyAccessible?: boolean;
  tags?: string[];
}

export type SortOrder = 'nearest' | 'alphabetical' | 'recently-added';

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}