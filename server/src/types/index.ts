import { Request } from 'express';

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

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
}
