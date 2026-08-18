import { Injectable } from '@angular/core';
import { db, ExpenseRow } from '../db/profitme.db';
import { SummaryService } from './summary.service';
import { MLForecastService } from './ml-forecast.service';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  constructor(
    private summary: SummaryService,
    private ml: MLForecastService
  ) {}

  async addExpense(data: { amount: number; category: string; date: string; note?: string }) {
    const row: ExpenseRow = {
      amount: Number(data.amount),
      category: (data.category ?? '').trim() || 'Γενικά',
      date: data.date,
      note: (data.note ?? '').trim()
    };

    if (!row.date) throw new Error('Missing date');
    if (!isFinite(row.amount) || row.amount <= 0) throw new Error('Invalid amount');

    const id = await db.expenses.add(row);

    try {
      await this.summary.recomputeMonthFromDate(row.date);
    } finally {
      await this.ml.invalidateModel(); // ✅ always invalidate
    }

    return { id, ...row };
  }

  async getExpenses(): Promise<ExpenseRow[]> {
    return db.expenses.orderBy('date').reverse().toArray();
  }

  async deleteExpense(id: number) {
    const existing = await db.expenses.get(id);
    await db.expenses.delete(id);

    try {
      if (existing?.date) {
        await this.summary.recomputeMonthFromDate(existing.date);
      }
    } finally {
      await this.ml.invalidateModel(); // ✅ always invalidate
    }
  }
}
