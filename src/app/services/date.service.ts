import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DateService {
  getCurrentMonth(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`; // π.χ. "2026-01"
  }

  // προαιρετικό για UI label
  getMonthLabel(yyyyMM: string): string {
    if (!yyyyMM || yyyyMM.length !== 7) return '';

    const [y, m] = yyyyMM.split('-').map(Number);

    const date = new Date(y, m - 1, 1);

    return date.toLocaleString('el-GR', {
      month: 'long',
      year: 'numeric'
    });
}

}
