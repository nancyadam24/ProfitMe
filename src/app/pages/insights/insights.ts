import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { InsightsService, Tx, MonthSummary } from '../../services/insights.service';
import { DateService } from '../../services/date.service';
import { AppUXService } from '../../services/app-ux.service';

type PieSlice = { label: string; value: number; cls: string };

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './insights.html',
  styleUrls: ['./insights.css']
})
export class InsightsComponent {
  months: string[] = [];
  selectedMonth = '';

  summary: MonthSummary | null = null;

  editing = false;
  editTx: Tx | null = null;

  deleteOpen = false;
  deleteTarget: Tx | null = null;

  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private insights: InsightsService,
    private dateService: DateService,
    private ux: AppUXService
  ) {}

  async ngOnInit() {
    this.months = await this.insights.listAvailableMonths();

    const current = this.dateService.getCurrentMonth();
    this.selectedMonth = this.months.includes(current) ? current : (this.months[0] || current);

    await this.load();
    this.ux.scrollTop(false);
  }

  monthLabel(ym: string): string {
    const [year, month] = ym.split('-');
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
    return date.toLocaleDateString('el-GR', { year: 'numeric', month: 'long' });
  }

  async onMonthChange() {
    await this.load();
    this.ux.scrollTop(false);
  }

  async load() {
    try {
      this.summary = await this.insights.getMonthSummary(this.selectedMonth);
    } catch (e) {
      console.error(e);
      this.summary = {
        incomeTotal: 0,
        expenseTotal: 0,
        netProfit: 0,
        incomeByCat: {},
        expenseByCat: {},
        txs: []
      };
      this.toast('Κάτι πήγε στραβά στο φόρτωμα.', 'error');
    }
  }

  // “pie” slices
  get pie(): PieSlice[] {
    const s = this.summary;
    if (!s) return [];

    const income = Math.max(0, Number(s.incomeTotal || 0));
    const expense = Math.max(0, Number(s.expenseTotal || 0));
    const net = Math.max(0, Number(s.netProfit || 0));

    return [
      { label: 'Έσοδα', value: income, cls: 'pie-income' },
      { label: 'Έξοδα', value: expense, cls: 'pie-expense' },
      { label: 'Καθαρό', value: net, cls: 'pie-profit' }
    ];
  }

  get pieTotal(): number {
    const total = this.pie.reduce((a, b) => a + (Number(b.value) || 0), 0);
    return total > 0 ? total : 1;
  }

  get pieView(): Array<PieSlice & { p: number; o: number }> {
    let offset = 0;
    return this.pie.map(s => {
      const p = this.pieTotal > 0 ? (s.value / this.pieTotal) * 100 : 0;
      const slice = { ...s, p, o: offset };
      offset += p;
      return slice;
    });
  }

  piePercent(value: number): number {
    return Math.round((Number(value || 0) / this.pieTotal) * 100);
  }

  entriesSorted(obj: Record<string, number>): { key: string; val: number }[] {
    return Object.entries(obj || {})
      .map(([key, val]) => ({ key, val: Number(val || 0) }))
      .sort((a, b) => b.val - a.val);
  }

  // ---------------- edit ----------------
  openEdit(tx: Tx) {
    this.ux.lockScroll();
    this.editing = true;
    this.editTx = { ...tx };
  }

  closeEdit() {
    this.ux.unlockScroll();
    this.editing = false;
    this.editTx = null;
  }

  async saveEdit() {
    const tx = this.editTx;
    if (!tx) return;

    // validations FIRST
    if (!tx.amount || tx.amount <= 0) {
      this.ux.error();
      this.toast('Βάλε ποσό > 0.', 'error');
      return;
    }
    if (!tx.category) {
      this.ux.error();
      this.toast('Βάλε κατηγορία.', 'error');
      return;
    }
    if (!tx.date) {
      this.ux.error();
      this.toast('Βάλε ημερομηνία.', 'error');
      return;
    }

    try {
      await this.insights.updateTx(tx);

      this.ux.success();
      this.ux.blurActiveInput();

      this.toast('Η κίνηση ενημερώθηκε.', 'success');
      this.closeEdit();

      await this.load();
      this.ux.scrollTop(false);
    } catch (e) {
      console.error(e);
      this.ux.error();
      this.toast('Αποτυχία ενημέρωσης.', 'error');
    }
  }

  // ---------------- delete ----------------
  openDelete(tx: Tx) {
    this.ux.lockScroll();
    this.deleteTarget = { ...tx };
    this.deleteOpen = true;
  }

  closeDelete() {
    this.ux.unlockScroll();
    this.deleteOpen = false;
    this.deleteTarget = null;
  }

  async confirmDelete() {
    const d = this.deleteTarget;
    if (!d) return;

    if (d.id == null) {
      this.ux.error();
      this.toast('Λείπει id εγγραφής — δεν μπορεί να γίνει διαγραφή.', 'error');
      this.closeDelete();
      return;
    }

    try {
      await this.insights.deleteTx(d.type, d.id);

      this.ux.haptic(30);

      this.toast('Διαγράφηκε.', 'success');
      this.closeDelete();

      await this.load();
      this.ux.scrollTop(false);
    } catch (e) {
      console.error(e);
      this.ux.error();
      this.toast('Αποτυχία διαγραφής.', 'error');
    }
  }

  // ---------------- helpers ----------------
  toast(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = ''), 2200);
  }

  sign(tx: Tx) {
    return tx.type === 'income' ? '+' : '-';
  }

  txClass(tx: Tx) {
    return tx.type === 'income' ? 'income' : 'expense';
  }
}
