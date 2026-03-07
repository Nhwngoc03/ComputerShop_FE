// Installment Package API Types

export interface InstallmentPackageResponse {
  packageId: number;
  name: string;
  durationMonths: number;
  interestRate: number;
  minOrderAmount: number;
  maxOrderAmount?: number;
  description?: string;
  active: boolean; // Response uses 'active'
  createdAt?: string;
  updatedAt?: string;
}

export interface InstallmentPackageRequest {
  name: string;
  durationMonths: number;
  interestRate: number;
  minOrderAmount: number;
  maxOrderAmount?: number;
  description?: string;
  isActive?: boolean; // Request expects 'isActive'
}
