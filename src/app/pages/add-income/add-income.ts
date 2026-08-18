import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DateService } from '../../services/date.service';
import { IncomeService } from '../../services/income.service';
import { AppUXService } from '../../services/app-ux.service';

type MsgType = 'success' | 'error';

@Component({
  selector: 'app-add-income',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './add-income.html',
  styleUrls: ['./add-income.css']
})
export class AddIncomeComponent {

  currentMonth = '';

  amount: number | null = null;
  category = '';
  date = '';
  note = '';

  message = '';
  messageType: MsgType = 'success';
  submitted = false;

  minDate = '';
  maxDate = '';

  constructor(
    private dateService: DateService,
    private incomeService: IncomeService,
    private ux: AppUXService
  ) {}

  ngOnInit() {
    this.currentMonth = this.dateService.getCurrentMonth();
    const { min, max } = this.getCurrentMonthMinMax();
    this.minDate = min;
    this.maxDate = max;
  }

  get currentMonthLabel(): string {
    return this.dateService.getMonthLabel(this.currentMonth);
  }

  private msgTimer: any;

  private showMessage(type: MsgType, text: string) {
    this.messageType = type;
    this.message = text;

    clearTimeout(this.msgTimer);
    this.msgTimer = setTimeout(() => (this.message = ''), 3000);
  }

ngOnDestroy() {
  clearTimeout(this.msgTimer);
}


  private getCurrentMonthMinMax() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();

    const toYMD = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    return {
      min: toYMD(new Date(y, m, 1)),
      max: toYMD(new Date(y, m + 1, 0))
    };
  }

  async saveIncome() {
    this.submitted = true;
    this.message = '';

    if (!this.amount || this.amount <= 0) {
      this.ux.error();
      this.showMessage('error', 'Συμπλήρωσε αριθμητικό ποσό (> 0).');
      return;
    }
    if (!this.category) {
      this.ux.error();
      this.showMessage('error', 'Διάλεξε κατηγορία.');
      return;
    }
    if (!this.date || this.date < this.minDate || this.date > this.maxDate) {
      this.ux.error();
      this.showMessage('error', `Η ημερομηνία πρέπει να είναι μέσα στον ${this.currentMonth}.`);
      return;
    }

    try {
      await this.incomeService.addIncome({
        amount: this.amount,
        category: this.category,
        date: this.date,
        note: this.note
      });

      this.ux.success();
      this.ux.blurActiveInput();
      this.ux.scrollTop(true);

      this.showMessage('success', '✅ Το έσοδο αποθηκεύτηκε!');
      this.submitted = false;

      this.amount = null;
      this.category = '';
      this.date = '';
      this.note = '';
    } catch (err) {
      console.error(err);
      this.ux.error();
      this.showMessage('error', '❌ Κάτι πήγε στραβά στο save.');
    }
  }
}
