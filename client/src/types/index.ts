export enum UserRole {
  ADMIN = 'admin',
  COORDINATOR = 'coordinator',
  VOLUNTEER = 'volunteer',
}

export enum DisasterStatus {
  ACTIVE = 'active',
  CONTAINED = 'contained',
  RESOLVED = 'resolved',
}

export enum DisasterSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ResourceStatus {
  AVAILABLE = 'available',
  IN_TRANSIT = 'in_transit',
  DEPLOYED = 'deployed',
  DEPLETED = 'depleted',
}

export enum TaskStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  location?: {
    type: string;
    coordinates: number[];
  };
  skills?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface Disaster {
  _id: string;
  name: string;
  type: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
  };
  address?: string;
  status: DisasterStatus;
  severity: DisasterSeverity;
  reportedBy: string;
  casualties?: number;
  displaced?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  _id: string;
  title: string;
  message: string;
  priority: AlertPriority;
  disaster?: Disaster | string;
  targetRoles?: UserRole[];
  location?: {
    type: string;
    coordinates: number[];
  };
  readBy: Array<{ user: string; readAt: string }>;
  createdBy: string;
  createdAt: string;
}

export interface Shelter {
  _id: string;
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  type: 'shelter' | 'hospital' | 'distribution_center';
  capacity: number;
  currentOccupancy: number;
  amenities?: string[];
  contactPhone?: string;
}

export interface Resource {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  status: ResourceStatus;
  location?: {
    type: string;
    coordinates: number[];
  };
  disaster?: Disaster | string;
  allocatedTo?: string;
  notes?: string;
}

export interface VolunteerTask {
  _id: string;
  title: string;
  description: string;
  disaster?: Disaster | string;
  assignedTo: string;
  assignedBy: string;
  status: TaskStatus;
  priority: AlertPriority;
  location?: {
    type: string;
    coordinates: number[];
  };
  progressUpdates: Array<{
    message: string;
    userId: string;
    createdAt: string;
  }>;
}
