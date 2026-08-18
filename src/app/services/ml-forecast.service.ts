import { Injectable } from '@angular/core';
import { db } from '../db/profitme.db';

function toMonth(dateStr: string) {
  return dateStr.slice(0, 7);
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

@Injectable({ providedIn: 'root' })
export class MLForecastService {

  // simple dirty flag (future-proof, δεν χαλάει τίποτα)
  private modelDirty = true;

  /** Called όταν αλλάζουν έσοδα/έξοδα */
  async invalidateModel(): Promise<void> {
    this.modelDirty = true;
  }

  /** Forecast επόμενου μήνα βασισμένο σε net profit */
  async forecastNextMonthNetProfit(): Promise<number | null> {
    // marker only (δεν έχεις ακόμα πραγματικό model cache)
    this.modelDirty = false;

    const [incomes, expenses] = await Promise.all([
      db.incomes.toArray(),
      db.expenses.toArray()
    ]);

    // χρειάζονται τουλάχιστον 2 μήνες
    const months = new Set<string>();
    incomes.forEach(r => months.add(toMonth(r.date)));
    expenses.forEach(r => months.add(toMonth(r.date)));

    if (months.size < 2) return null;

    // συγκέντρωση ανά μήνα
    const incomeByMonth = new Map<string, number>();
    const expenseByMonth = new Map<string, number>();

    for (const r of incomes) {
      const m = toMonth(r.date);
      incomeByMonth.set(m, (incomeByMonth.get(m) || 0) + (Number(r.amount) || 0));
    }

    for (const r of expenses) {
      const m = toMonth(r.date);
      expenseByMonth.set(m, (expenseByMonth.get(m) || 0) + (Number(r.amount) || 0));
    }

    const sortedMonths = Array.from(months).sort();

    const nets = sortedMonths.map(m => {
      const inc = incomeByMonth.get(m) || 0;
      const exp = expenseByMonth.get(m) || 0;
      return inc - exp;
    });

    // weighted average (ML-like baseline)
    const last  = nets[nets.length - 1];
    const prev  = nets[nets.length - 2] ?? last;
    const prev2 = nets[nets.length - 3] ?? prev;

    const forecast = (last * 0.6) + (prev * 0.3) + (prev2 * 0.1);
    return round2(forecast);
  }
}
