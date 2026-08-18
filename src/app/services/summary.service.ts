import { Injectable } from '@angular/core';
import { db } from '../db/profitme.db';

@Injectable({ providedIn: 'root' })
export class SummaryService {

  /** παίρνει 'YYYY-MM-DD' και γυρνά 'YYYY-MM' */
  private toMonth(date: string): string {
    return date.slice(0, 7);
  }

  async recomputeMonthFromDate(date: string) {
    const month = this.toMonth(date);
    if (!month || month.length !== 7) return;
    await this.recomputeMonth(month);
  }

  /** Υπολογίζει totals από incomes/expenses και κάνει upsert στο monthSummaries */
  async recomputeMonth(month: string) {
    const incomes = await db.incomes.where('date').startsWith(month).toArray();
    const expenses = await db.expenses.where('date').startsWith(month).toArray();

    const incomeTotal = incomes.reduce((s, x) => s + Number(x.amount || 0), 0);
    const expenseTotal = expenses.reduce((s, x) => s + Number(x.amount || 0), 0);
    const netProfit = incomeTotal - expenseTotal;

    await db.monthSummaries.put({
      month,
      incomeTotal,
      expenseTotal,
      netProfit,
      updatedAt: new Date().toISOString()
    });

    return { month, incomeTotal, expenseTotal, netProfit };
  }

  getMonthSummary(month: string) {
    return db.monthSummaries.get(month);
  }
}
