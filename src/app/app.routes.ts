import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard';
import { AddIncomeComponent } from './pages/add-income/add-income';
import { AddExpenseComponent } from './pages/add-expense/add-expense';
import { GoalsComponent } from './pages/goals/goals';
import { ForecastComponent } from './pages/forecast/forecast';
import { InsightsComponent } from './pages/insights/insights';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-income', component: AddIncomeComponent },
  { path: 'add-expense', component: AddExpenseComponent },
  { path: 'goals', component: GoalsComponent },
  { path: 'forecast', component: ForecastComponent },
  { path: 'insights', component: InsightsComponent }
];

