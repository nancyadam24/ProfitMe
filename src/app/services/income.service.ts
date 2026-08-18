import { Injectable } from '@angular/core';
import { db, IncomeRow } from '../db/profitme.db';
import { SummaryService } from './summary.service';
import { MLForecastService } from './ml-forecast.service';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  constructor(
    private summary: SummaryService,
    private ml: MLForecastService
  ) {}

  async addIncome(data: { amount: number; category: string; date: string; note?: string }) {
    const row: IncomeRow = {
      amount: Number(data.amount),
      category: (data.category ?? '').trim() || 'Γενικά',
      date: data.date,
      note: (data.note ?? '').trim()
    };

    if (!row.date) throw new Error('Missing date');
    if (!isFinite(row.amount) || row.amount <= 0) throw new Error('Invalid amount');

    const id = await db.incomes.add(row);

    try {
      await this.summary.recomputeMonthFromDate(row.date);
    } finally {
      await this.ml.invalidateModel();
    }

    return { id, ...row };
  }

  async getIncomes(): Promise<IncomeRow[]> {
    return db.incomes.orderBy('date').reverse().toArray();
  }

  async deleteIncome(id: number) {
    const existing = await db.incomes.get(id);
    await db.incomes.delete(id);

    try {
      if (existing?.date) {
        await this.summary.recomputeMonthFromDate(existing.date);
      }
    } finally {
      await this.ml.invalidateModel();
    }
  }
}
