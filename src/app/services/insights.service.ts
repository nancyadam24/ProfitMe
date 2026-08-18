import { Injectable } from '@angular/core';
import { db, IncomeRow, ExpenseRow } from '../db/profitme.db';
import { DateService } from './date.service';
import { MLForecastService } from './ml-forecast.service';
import { SummaryService } from './summary.service';

export type TxType = 'income' | 'expense';

export type Tx = {
  type: TxType;
  id: number;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note?: string;
};

export type MonthSummary = {
  incomeTotal: number;
  expenseTotal: number;
  netProfit: number;
  incomeByCat: Record<string, number>;
  expenseByCat: Record<string, number>;
  txs: Tx[];
};

function toYear(dateStr: string) {
  return dateStr.slice(0, 4);
}
function toMonth(dateStr: string) {
  return dateStr.slice(0, 7);
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

@Injectable({ providedIn: 'root' })
export class InsightsService {
  constructor(
    private dateService: DateService,
    private mlForecast: MLForecastService,
    private summary: SummaryService
  ) {}

  async listAvailableMonths(): Promise<string[]> {
    const [incomes, expenses] = await Promise.all([db.incomes.toArray(), db.expenses.toArray()]);

    const set = new Set<string>();
    incomes.forEach(r => set.add(toMonth(r.date)));
    expenses.forEach(r => set.add(toMonth(r.date)));

    return [...set].sort((a, b) => b.localeCompare(a));
  }

  async listAvailableYears(): Promise<string[]> {
    const [incomes, expenses] = await Promise.all([db.incomes.toArray(), db.expenses.toArray()]);

    const set = new Set<string>();
    incomes.forEach(r => set.add(toYear(r.date)));
    expenses.forEach(r => set.add(toYear(r.date)));

    return [...set].sort((a, b) => b.localeCompare(a));
  }

  async getMonthSummary(month: string): Promise<MonthSummary> {
    const [incomes, expenses] = await Promise.all([
      db.incomes.where('date').between(`${month}-01`, `${month}-31`, true, true).toArray(),
      db.expenses.where('date').between(`${month}-01`, `${month}-31`, true, true).toArray()
    ]);

    let incomeTotal = 0;
    let expenseTotal = 0;

    const incomeByCat: Record<string, number> = {};
    const expenseByCat: Record<string, number> = {};
    const txs: Tx[] = [];

    for (const r of incomes) {
      const amt = Number(r.amount || 0);
      incomeTotal += amt;

      const cat = (r.category || 'Other').trim();
      incomeByCat[cat] = (incomeByCat[cat] || 0) + amt;

      if (r.id != null) {
        txs.push({ type: 'income', id: r.id, amount: amt, category: cat, date: r.date, note: r.note });
      }
    }

    for (const r of expenses) {
      const amt = Number(r.amount || 0);
      expenseTotal += amt;

      const cat = (r.category || 'Other').trim();
      expenseByCat[cat] = (expenseByCat[cat] || 0) + amt;

      if (r.id != null) {
        txs.push({ type: 'expense', id: r.id, amount: amt, category: cat, date: r.date, note: r.note });
      }
    }

    txs.sort((a, b) => b.date.localeCompare(a.date));

    return {
      incomeTotal: round2(incomeTotal),
      expenseTotal: round2(expenseTotal),
      netProfit: round2(incomeTotal - expenseTotal),
      incomeByCat: Object.fromEntries(Object.entries(incomeByCat).map(([k, v]) => [k, round2(v)])),
      expenseByCat: Object.fromEntries(Object.entries(expenseByCat).map(([k, v]) => [k, round2(v)])),
      txs
    };
  }

  async updateTx(tx: Tx): Promise<void> {
    // basic safety
    if (!tx.date) throw new Error('Missing date');
    if (!isFinite(Number(tx.amount)) || Number(tx.amount) <= 0) throw new Error('Invalid amount');

    if (tx.type === 'income') {
      const row: IncomeRow = {
        id: tx.id,
        amount: Number(tx.amount || 0),
        category: (tx.category || '').trim() || 'Γενικά',
        date: tx.date,
        note: (tx.note ?? '').trim()
      };
      await db.incomes.put(row);
    } else {
      const row: ExpenseRow = {
        id: tx.id,
        amount: Number(tx.amount || 0),
        category: (tx.category || '').trim() || 'Γενικά',
        date: tx.date,
        note: (tx.note ?? '').trim()
      };
      await db.expenses.put(row);
    }

    // ✅ keep summaries consistent
    await this.summary.recomputeMonthFromDate(tx.date);

    // ✅ invalidate ML so next forecast retrains/refreshes
    await this.mlForecast.invalidateModel();
  }

  async deleteTx(type: TxType, id: number): Promise<void> {
    // we need the date BEFORE deleting so we can recompute summary
    let date: string | null = null;

    if (type === 'income') {
      const existing = await db.incomes.get(id);
      date = existing?.date ?? null;
      await db.incomes.delete(id);
    } else {
      const existing = await db.expenses.get(id);
      date = existing?.date ?? null;
      await db.expenses.delete(id);
    }

    if (date) {
      await this.summary.recomputeMonthFromDate(date);
    }

    await this.mlForecast.invalidateModel();
  }
}
