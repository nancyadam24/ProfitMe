import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DateService } from '../../services/date.service';
import { SummaryService } from '../../services/summary.service';
import { GoalService } from '../../services/goal.service';
import { HybridForecastService } from '../../services/hybrid-forecast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  private destroyRef = inject(DestroyRef);

  currentMonth = '';

  // ==============================
  // CURRENT MONTH
  // ==============================
  monthlyIncome = 0;
  monthlyExpenses = 0;
  netProfit = 0;

  // ==============================
  // PREVIOUS MONTH
  // ==============================
  previousMonthIncome = 0;
  previousMonthExpenses = 0;
  previousMonthNetProfit = 0;

  // ==============================
  // % CHANGE VS PREVIOUS MONTH
  // null = δεν υπάρχει σωστή βάση σύγκρισης
  // π.χ. προηγούμενος μήνας = 0
  // ==============================
  incomeChangePercent: number | null = 0;
  expensesChangePercent: number | null = 0;
  profitChangePercent: number | null = 0;

  // ==============================
  // GOAL
  // ==============================
  goal = 0;
  progress = 0;
  editingGoal = false;

  // ==============================
  // FORECAST
  // ==============================
  forecastValue: number | null = null;
  forecastLoading = true;

  private refreshing = false;

  constructor(
    private dateService: DateService,
    private summaryService: SummaryService,
    private goalService: GoalService,
    private forecastService: HybridForecastService,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.router.url.startsWith('/dashboard')) {
          void this.refreshDashboard(false);
        }
      });
  }

  async ngOnInit() {
    await this.refreshDashboard(true);
  }

  // ==============================
  // CURRENT MONTH LABEL
  // ==============================
  get currentMonthLabel(): string {
    return this.dateService.getMonthLabel(this.currentMonth);
  }

  // ==============================
  // REFRESH DASHBOARD
  // ==============================
  private async refreshDashboard(force: boolean) {
    if (this.refreshing) return;

    this.refreshing = true;

    try {
      // π.χ. "2026-08"
      this.currentMonth = this.dateService.getCurrentMonth();

      // Goal του τρέχοντος μήνα
      this.goal = await this.goalService.getGoal(this.currentMonth);

      // Τρέχων + προηγούμενος μήνας
      await this.loadMonthSummary();

      // Forecast
      this.forecastLoading = true;
      this.forecastValue = null;

      const value =
        await this.forecastService.forecastNextMonthNetProfit();

      this.forecastValue = value;

    } catch (e) {
      console.error('Dashboard refresh error:', e);

      this.forecastValue = null;

    } finally {
      this.forecastLoading = false;

      this.recalcProgress();

      this.refreshing = false;
    }
  }

  // ==============================
  // LOAD CURRENT + PREVIOUS MONTH
  // ==============================
  async loadMonthSummary() {
    const currentMonth = this.currentMonth;

    const previousMonth =
      this.getPreviousMonth(currentMonth);

    /*
     * Τρέχων μήνας
     */
    const current =
      await this.summaryService.recomputeMonth(currentMonth);

    this.monthlyIncome =
      Number(current.incomeTotal || 0);

    this.monthlyExpenses =
      Number(current.expenseTotal || 0);

    this.netProfit =
      Number(current.netProfit || 0);

    /*
     * Προηγούμενος μήνας
     */
    const previous =
      await this.summaryService.recomputeMonth(previousMonth);

    this.previousMonthIncome =
      Number(previous.incomeTotal || 0);

    this.previousMonthExpenses =
      Number(previous.expenseTotal || 0);

    this.previousMonthNetProfit =
      Number(previous.netProfit || 0);

    /*
     * Υπολογισμός μεταβολών
     */
    this.incomeChangePercent =
      this.calculatePercentageChange(
        this.monthlyIncome,
        this.previousMonthIncome
      );

    this.expensesChangePercent =
      this.calculatePercentageChange(
        this.monthlyExpenses,
        this.previousMonthExpenses
      );

    this.profitChangePercent =
      this.calculatePercentageChange(
        this.netProfit,
        this.previousMonthNetProfit
      );

    this.recalcProgress();
  }

  // ==============================
  // GET PREVIOUS MONTH
  //
  // 2026-08 -> 2026-07
  // 2026-01 -> 2025-12
  // ==============================
  private getPreviousMonth(month: string): string {
    if (!month) {
      return '';
    }

    const [yearString, monthString] = month.split('-');

    const year = Number(yearString);
    const monthNumber = Number(monthString);

    /*
     * JS Date:
     * January = 0
     * February = 1
     * ...
     *
     * Επειδή το monthNumber είναι 1-12,
     * βάζοντας monthNumber - 2 παίρνουμε
     * τον προηγούμενο μήνα.
     */
    const date = new Date(
      year,
      monthNumber - 2,
      1
    );

    const previousYear =
      date.getFullYear();

    const previousMonthNumber =
      String(date.getMonth() + 1)
        .padStart(2, '0');

    return `${previousYear}-${previousMonthNumber}`;
  }

  // ==============================
  // % CHANGE
  //
  // previous = 100
  // current = 120
  //
  // => +20%
  // ==============================
  private calculatePercentageChange(
    current: number,
    previous: number
  ): number | null {

    /*
     * Αν και οι δύο μήνες είναι 0,
     * θεωρούμε ότι δεν υπάρχει μεταβολή.
     */
    if (previous === 0 && current === 0) {
      return 0;
    }

    /*
     * Αν ο προηγούμενος μήνας ήταν 0
     * αλλά τώρα έχουμε ποσό,
     * μαθηματικά το % δεν μπορεί να
     * υπολογιστεί σωστά.
     *
     * Αποφεύγουμε Infinity%.
     */
    if (previous === 0) {
      return null;
    }

    const change =
      ((current - previous) / Math.abs(previous)) * 100;

    /*
     * 1 δεκαδικό
     *
     * 12.345 -> 12.3
     */
    return Math.round(change * 10) / 10;
  }

  // ==============================
  // TEXT ΓΙΑ ΤΟ CHIP
  //
  // +12.3% vs προηγούμενος μήνας
  // -5% vs προηγούμενος μήνας
  // ==============================
  changeLabel(
    value: number | null
  ): string {

    if (value === null) {
      return '— vs προηγούμενος μήνας';
    }

    const sign =
      value > 0 ? '+' : '';

    return `${sign}${value}% vs προηγούμενος μήνας`;
  }

  // ==============================
  // INCOME CHIP CLASS
  //
  // περισσότερα έσοδα = positive
  // λιγότερα έσοδα = negative
  // ==============================
  incomeChangeClass(): string {
    if (this.incomeChangePercent === null) {
      return 'neutral';
    }

    if (this.incomeChangePercent > 0) {
      return 'positive';
    }

    if (this.incomeChangePercent < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  // ==============================
  // EXPENSE CHIP CLASS
  //
  // περισσότερα έξοδα = BAD -> negative
  // λιγότερα έξοδα = GOOD -> positive
  // ==============================
  expensesChangeClass(): string {
    if (this.expensesChangePercent === null) {
      return 'neutral';
    }

    if (this.expensesChangePercent > 0) {
      return 'negative';
    }

    if (this.expensesChangePercent < 0) {
      return 'positive';
    }

    return 'neutral';
  }

  // ==============================
  // PROFIT CHIP CLASS
  //
  // περισσότερο κέρδος = positive
  // λιγότερο κέρδος = negative
  // ==============================
  profitChangeClass(): string {
    if (this.profitChangePercent === null) {
      return 'neutral';
    }

    if (this.profitChangePercent > 0) {
      return 'positive';
    }

    if (this.profitChangePercent < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  // ==============================
  // GOAL PROGRESS
  // ==============================
  private recalcProgress() {
    this.netProfit =
      this.monthlyIncome - this.monthlyExpenses;

    if (
      this.goal <= 0 ||
      this.netProfit <= 0
    ) {
      this.progress = 0;
      return;
    }

    let percent =
      (this.netProfit / this.goal) * 100;

    percent =
      Math.max(
        0,
        Math.min(100, percent)
      );

    this.progress =
      Math.round(percent * 10) / 10;
  }

  // ==============================
  // SAVE GOAL
  // ==============================
  async saveGoal() {
    if (this.goal < 0) {
      this.goal = 0;
    }

    await this.goalService.setGoal(
      this.currentMonth,
      this.goal
    );

    this.recalcProgress();

    this.editingGoal = false;
  }
}