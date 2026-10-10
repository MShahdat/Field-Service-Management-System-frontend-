export interface AdminAnalytics {
  totalCustomers: number;
  totalManagers: number;
  totalTechnicians: number;
  rejectedManagers: number;
  pendingManagers: number;
  totalServices: number;
  cancelledServices: number;
  pendingServices: number;
  rejectedServices: number;
  totalWorkOrders: number;
  totalStartedWorkOrders: number;
  totalRevenue: string;
  totalRefunded: string;
  currentMonthRevenue: string;
}

export interface ManagerAnalytics {
  coverRegions: number;
  assignedServices: number;
  rejectedServices: number;
  completedWorkByTechnicians: number;
  totalEarnings: string;
  totalRefunded: string;
  currentMonthRevenue: string;
}

export interface TechnicianAnalytics {
  completedWorkOrders: number;
  startedWorkOrders: number;
  totalEarnings: string;
  totalRefunded: string;
  currentMonthRevenue: string;
  coverRegions: number;
  completeJobs: number;
  avgRating: number;
}

export interface CustomerAnalytics {
  totalServices: number;
  cancelledServices: number;
  pendingServices: number;
  rejectedServices: number;
  completedServices: number;
  completedWorkOrders: number;
  totalStartedWorkOrders: number;
  totalSpend: string;
  totalRefund: string;
}
