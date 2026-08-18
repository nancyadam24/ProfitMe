import { Injectable } from '@angular/core';
import { db } from '../db/profitme.db';
import { MLForecastService } from './ml-forecast.service';

function toMonth(dateStr: string) {
  return dateStr.slice(0, 7);
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

@Injectable({ providedIn: 'root' })
export class HybridForecastService {
  constructor(private ml: MLForecastService) {}

  private computeDistinctMonths(incomes: any[], expenses: any[]): string[] {
    const set = new Set<string>();
    incomes.forEach(r => set.add(toMonth(r.date)));
    expenses.forEach(r => set.add(toMonth(r.date)));
    return Array.from(set).sort();
  }

  private computeMonthNetProfit(incomes: any[], expenses: any[], month: string): number {
    const inc = incomes
      .filter(r => toMonth(r.date) === month)
      .reduce((s, r) => s + (Number(r.amount) || 0), 0);

    const exp = expenses
      .filter(r => toMonth(r.date) === month)
      .reduce((s, r) => s + (Number(r.amount) || 0), 0);

    return round2(inc - exp);
  }

  /** Main method used by UI */
  async forecastNextMonthNetProfit(): Promise<number | null> {
    const [incomes, expenses] = await Promise.all([
      db.incomes.toArray(),
      db.expenses.toArray()
    ]);

    const months = this.computeDistinctMonths(incomes, expenses);
    if (months.length === 0) return null;

    // If enough data, use ML
    if (months.length >= 2) {
      const mlVal = await this.ml.forecastNextMonthNetProfit();
      if (mlVal !== null) return mlVal;
    }

    // Fallback: last month net profit
    const lastMonth = months[months.length - 1];
    return this.computeMonthNetProfit(incomes, expenses, lastMonth);
  }
}
