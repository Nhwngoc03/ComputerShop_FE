// Installment Package API Types

export interface InstallmentPackageResponse {
  packageId: number;
  name: string;
  durationMonths: number;
  interestRate: number;
  minOrderAmount: number;
  downPaymentPercentage: number;
  active: boolean; // Java serializes boolean isActive -> "active"
}

export interface InstallmentPackageRequest {
  name: string;
  durationMonths: number;
  interestRate: number;
  minOrderAmount: number;
  downPaymentPercentage: number;
  isActive?: boolean;
}
