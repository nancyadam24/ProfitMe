import Dexie, { Table } from 'dexie';

export interface IncomeRow {
  id?: number;
  amount: number;
  category: string;
  date: string;   // 'YYYY-MM-DD'
  note?: string;
}

export interface ExpenseRow {
  id?: number;
  amount: number;
  category: string;
  date: string;   // 'YYYY-MM-DD'
  note?: string;
}

/** Αποθηκευμένο summary ανά μήνα */
export interface MonthSummaryRow {
  id?: number;
  month: string;        // 'YYYY-MM' (PRIMARY KEY)
  incomeTotal: number;
  expenseTotal: number;
  netProfit: number;
  updatedAt: string;    // ISO
}

export interface MonthlyGoalRow {
  goal: number;
  updatedAt: string;
  month: string;   // 'YYYY-MM-DD'
}

export interface MonthForecastRow {
  month: string;          // target month 'YYYY-MM' (PK)
  incomePred: number;
  expensePred: number;
  netPred: number;

  confLow: number;        // net low
  confHigh: number;       // net high

  reasons: string[];      // bullets
  model: string;          // 'profitme_forecast_v1'
  updatedAt: string;      // ISO

  confidence?: number;   // 0-100 (optional, not stored)
}

export class ProfitMeDB extends Dexie {
  incomes!: Table<IncomeRow, number>;
  expenses!: Table<ExpenseRow, number>;
  monthSummaries!: Table<MonthSummaryRow, string>;
  monthGoals!: Table<MonthlyGoalRow, string>;
  monthForecasts!: Table<MonthForecastRow, string>;

  constructor() {
    super('ProfitMeDB');

    // v1 (παλιό)
    this.version(1).stores({
      incomes: '++id, date, category',
      expenses: '++id, date, category'
    });

    // v2 (νέο) + monthSummaries
    this.version(2).stores({
      incomes: '++id, date, category',
      expenses: '++id, date, category',
      monthSummaries: 'month' // primary key
    });

    // v3 + monthGoals
    this.version(3).stores({
      incomes: '++id, date, category',
      expenses: '++id, date, category',
      monthSummaries: 'month',
      monthGoals: 'month'
    });

    // v4 + monthForecasts
    this.version(4).stores({
      incomes: '++id, date, category',
      expenses: '++id, date, category',
      monthSummaries: 'month',
      monthGoals: 'month',
      monthForecasts: 'month'
    });
  }
}

export const db = new ProfitMeDB();
