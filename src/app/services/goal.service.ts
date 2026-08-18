import { Injectable } from '@angular/core';
import { db } from '../db/profitme.db';
import type { MonthlyGoalRow } from '../db/profitme.db';

@Injectable({ providedIn: 'root' })
export class GoalService {

  async getGoal(month: string): Promise<number> {
    const row = await db.monthGoals.get(month);
    return row ? Number(row.goal) : 0;
}

async setGoal(month: string, goal: number): Promise<void> {
  const g = Number(goal || 0);

  await db.monthGoals.put({
    month,
    goal: g < 0 ? 0 : g,
    updatedAt: new Date().toISOString()
  });
}
}
