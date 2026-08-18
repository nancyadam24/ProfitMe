import { Injectable } from '@angular/core';
import { db, MonthForecastRow } from '../db/profitme.db';

type MonthAgg = {
  month: string;
  income: number;
  expense: number;
  net: number;
  expenseByCat: Record<string, number>;
};

function toMonth(dateStr: string): string {
  return dateStr.slice(0, 7); // YYYY-MM
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const a = [...nums].sort((x, y) => x - y);
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

@Injectable({ providedIn: 'root' })
export class ForecastService {

  async forecastNextMonth(
    currentMonth: string,
    force = false
  ): Promise<MonthForecastRow> {

    const targetMonth = this.shiftMonths(currentMonth, 1);

    if (!force) {
      const cached = await db.monthForecasts.get(targetMonth);
      if (cached) return cached;
    }

    const hist = await this.buildMonthlyAgg();
    const usable = hist.filter(h => h.month <= currentMonth);

    // ---- fallback αν έχουμε λίγα δεδομένα
    if (usable.length < 2) {
      const last = usable[usable.length - 1];
      const incomePred = last?.income ?? 0;
      const expensePred = last?.expense ?? 0;
      const netPred = incomePred - expensePred;

      return this.save(
        targetMonth,
        incomePred,
        expensePred,
        netPred,
        netPred - 200,
        netPred + 200,
        ['Λίγα δεδομένα: χρησιμοποιήθηκε ο τελευταίος διαθέσιμος μήνας ως βάση.']
      );
    }

    const last = usable[usable.length - 1];
    const last6 = usable.slice(-6);

    // ---- trends
    const incTrend = median(
      last6.slice(1).map((v, i) => v.income - last6[i].income)
    );

    const expTrend = median(
      last6.slice(1).map((v, i) => v.expense - last6[i].expense)
    );

    // ---- seasonality
    const sameMonthLY = usable.find(
      x => x.month === this.shiftMonths(targetMonth, -12)
    );

    const last12 = usable.slice(-12);
    const baseInc = median(last12.map(x => x.income));
    const baseExp = median(last12.map(x => x.expense));

    const incSeason = sameMonthLY ? sameMonthLY.income - baseInc : 0;
    const expSeason = sameMonthLY ? sameMonthLY.expense - baseExp : 0;

    // ---- fixed costs
    const fixedInfo = this.detectFixedCosts(last6);

    let incomePred = Math.max(0, last.income + incTrend + incSeason);
    let expensePred = Math.max(
      last.expense + expTrend + expSeason,
      fixedInfo.fixedTotal
    );

    const netPred = incomePred - expensePred;

    // ---- confidence / volatility
    const netSeries = last6.map(x => x.net);
    const volatility = Math.max(
      50,
      median(
        netSeries.slice(1).map((v, i) => Math.abs(v - netSeries[i]))
      ) * 1.5
    );

    // ---- reasons
    const reasons: string[] = [];

    if (incTrend !== 0) {
      reasons.push(
        `Τάση εσόδων: ${incTrend >= 0 ? '+' : ''}€${round2(incTrend)}/μήνα.`
      );
    }

    if (expTrend !== 0) {
      reasons.push(
        `Τάση εξόδων: ${expTrend >= 0 ? '+' : ''}€${round2(expTrend)}/μήνα.`
      );
    }

    if (sameMonthLY) {
      reasons.push('Εποχικότητα: επηρεασμός από τον ίδιο μήνα πέρσι.');
    }

    if (fixedInfo.fixedTotal > 0) {
      const cats = fixedInfo.topFixedCats
        .slice(0, 3)
        .map(x => `${x.cat} (~€${round2(x.avg)})`);

      reasons.push(
        `Σταθερά έξοδα: ~€${round2(fixedInfo.fixedTotal)} (${cats.join(', ')}).`
      );
    }

    reasons.push(`Αβεβαιότητα: ±€${round2(volatility)}.`);

    return this.save(
      targetMonth,
      incomePred,
      expensePred,
      netPred,
      netPred - volatility,
      netPred + volatility,
      reasons
    );
  }

  // ----------------------------------------------------------------

  private async save(
    month: string,
    incomePred: number,
    expensePred: number,
    netPred: number,
    confLow: number,
    confHigh: number,
    reasons: string[]
  ): Promise<MonthForecastRow> {

    const row: MonthForecastRow = {
      month,
      incomePred: round2(incomePred),
      expensePred: round2(expensePred),
      netPred: round2(netPred),
      confLow: round2(confLow),
      confHigh: round2(confHigh),
      reasons,
      model: 'profitme_forecast_v1',
      updatedAt: new Date().toISOString()
    };

    await db.monthForecasts.put(row);
    return row;
  }

  private async buildMonthlyAgg(): Promise<MonthAgg[]> {
    const [incomes, expenses] = await Promise.all([
      db.incomes.toArray(),
      db.expenses.toArray()
    ]);

    const map = new Map<string, MonthAgg>();

    for (const r of incomes) {
      const m = toMonth(r.date);
      const cur =
        map.get(m) ??
        { month: m, income: 0, expense: 0, net: 0, expenseByCat: {} };

      cur.income += Number(r.amount || 0);
      map.set(m, cur);
    }

    for (const r of expenses) {
      const m = toMonth(r.date);
      const cur =
        map.get(m) ??
        { month: m, income: 0, expense: 0, net: 0, expenseByCat: {} };

      const amt = Number(r.amount || 0);
      cur.expense += amt;

      const cat = (r.category || 'Other').trim();
      cur.expenseByCat[cat] =
        (cur.expenseByCat[cat] || 0) + amt;

      map.set(m, cur);
    }

    return [...map.values()]
      .map(x => ({ ...x, net: x.income - x.expense }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private detectFixedCosts(lastMonths: MonthAgg[]) {
    const months = lastMonths.slice(-4);
    const cats = new Set<string>();

    months.forEach(m =>
      Object.keys(m.expenseByCat).forEach(c => cats.add(c))
    );

    const fixedCats: { cat: string; avg: number; cv: number }[] = [];

    for (const cat of cats) {
      const vals = months.map(m => m.expenseByCat[cat] ?? 0);
      const present = vals.filter(v => v > 0).length;
      if (present < 3) continue;

      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      if (avg <= 0) continue;

      const mad = median(vals.map(v => Math.abs(v - avg)));
      const cv = mad / avg;

      if (cv <= 0.35) {
        fixedCats.push({ cat, avg, cv });
      }
    }

    fixedCats.sort((a, b) => b.avg - a.avg);
    const fixedTotal = fixedCats.reduce((s, x) => s + x.avg, 0);

    return { fixedTotal, topFixedCats: fixedCats };
  }

  private shiftMonths(month: string, delta: number): string {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
}
