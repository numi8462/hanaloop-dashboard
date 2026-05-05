export type EmissionType = "전기" | "원소재" | "운송";

export type GhgScope = "스코프 1" | "스코프 2" | "스코프 3";

export const SCOPE_MAP: Record<EmissionType, GhgScope> = {
  전기: "스코프 2",
  원소재: "스코프 3",
  운송: "스코프 3",
};

export const UNIT_MAP: Record<EmissionType, string> = {
  전기: "kWh",
  원소재: "kg",
  운송: "ton-km",
};

export interface ActivityData {
  id: string;
  date: string;
  type: EmissionType;
  description: string;
  amount: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityInput = Omit<
  ActivityData,
  "id" | "createdAt" | "updatedAt"
>;

export interface EmissionFactor {
  id: string;
  type: EmissionType;
  description: string;
  emissionFactor: number;
  unit: string;
  version: number;
  isActive: boolean;
  validFrom: string;
  validTo: string | null;
  createdAt: string;
}

export interface PcfResult {
  id: string;
  date: string;
  type: EmissionType;
  description: string;
  amount: number;
  unit: string;
  emissionFactor: number;
  emissionFactorId: string;
  co2e: number;
  scope: GhgScope;
  calculatedAt: string;
}

export interface CategorySummary {
  type: EmissionType;
  totalCo2e: number;
  scope: GhgScope;
  percentage: number;
  count: number;
}

export interface MonthlySummary {
  yearMonth: string;
  totalCo2e: number;
  byType: Record<EmissionType, number>;
}

export interface DashboardSummary {
  totalCo2e: number;
  byCategory: CategorySummary[];
  byMonth: MonthlySummary[];
  lastUpdated: string;
}

export interface ActivityFormValues {
  date: string;
  type: EmissionType;
  description: string;
  amount: number;
  unit: string;
}
