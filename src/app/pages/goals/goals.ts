import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalService } from '../../services/goal.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals.html',
  styleUrls: ['./goals.css']
})
export class GoalsComponent implements OnInit {
  currentMonth = '';
  monthlyGoal = 0;

  constructor(private goalService: GoalService) {}

  async ngOnInit() {
    this.currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
    await this.loadMonthlyGoal();
  }

  async loadMonthlyGoal() {
    this.monthlyGoal = await this.goalService.getGoal(this.currentMonth);
  }

  async saveMonthlyGoal() {
    await this.goalService.setGoal(this.currentMonth, Number(this.monthlyGoal));
    // προαιρετικά ξαναφόρτωση για επιβεβαίωση
    await this.loadMonthlyGoal();
  }
}
