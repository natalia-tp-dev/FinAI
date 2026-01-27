import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reports } from '../../../../../services/reports/reports';
import { IndividualReportResponse } from '../../../../../interfaces/data/ai-model';
import { GoalService } from '../../../../../services/saving-goal/goal-service';
import { User } from '../../../../../services/user/user';
import { GoalData } from '../../../../../interfaces/data/goal-data';

@Component({
  selector: 'app-predictions',
  imports: [CommonModule],
  templateUrl: './predictions.html',
  styleUrl: './predictions.css',
})
export class Predictions {
  private reportService = inject(Reports)
  private goalService = inject(GoalService)
  private userService = inject(User)
  public goalList = signal<GoalData[]>([])

  selectedReport = signal<IndividualReportResponse | null>(null)
  
  constructor() {
    effect(() => {
      const userId = this.userService.userId()

      if (userId) {
        this.loadGoalsData(userId)
      }
    })
  }

  loadGoalsData(userId: string) {
    this.goalService.getGoals(userId).subscribe({
      next: res => this.goalList.set(res.result)
    })
  }

  loadReport(goalId: number) {
    this.reportService.getReport(goalId).subscribe({
      next: data => {
        this.selectedReport.set(data)
      },
      error: err => {
        console.log(err.err.err);
      }
    })
  }
}
