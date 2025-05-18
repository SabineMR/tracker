export interface DebtItem {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface WorkSession {
  id: string;
  date: string;
  hours: number;
  fullPayment: boolean; // true = 100%, false = 35%
  amountApplied: number; // calculated amount applied to debt
}

export interface Summary {
  totalDebt: number;
  totalPaid: number;
  remainingBalance: number;
}

export interface ChartData {
  labels: string[];
  debt: number[];
  repayment: number[];
}