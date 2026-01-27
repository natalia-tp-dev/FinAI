import { Component, computed, effect, EventEmitter, inject, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalData } from '../../../../../interfaces/data/goal-data';
import { User } from '../../../../../services/user/user';
import { GoalService } from '../../../../../services/saving-goal/goal-service';

@Component({
  selector: 'app-saving-goals',
  imports: [CommonModule],
  templateUrl: './saving-goals.html',
  styleUrl: './saving-goals.css',
})

export class SavingGoals {

  @Output() onOpenAddGoal = new EventEmitter<void>()
  @Output() onOpenStatus = new EventEmitter<void>()
  @Output() onOpenUpdateGoal = new EventEmitter<void>()
  private userService = inject(User)
  private goalService = inject(GoalService)
  public goalList = signal<GoalData[]>([])
  public totalSaved = computed(() =>
    this.goalList().reduce((acc, goal) => acc + Number(goal.current_amount), 0)
  )
  public globalGoal = computed(() =>
    this.goalList().reduce((acc, goal) => acc + Number(goal.target_amount), 0)
  )
  
  public generalProgress = computed(() => {
    const target = this.globalGoal();
    if (target === 0) return 0;
    return (this.totalSaved() / target) * 100;
  });

  onOpenCard() {
    this.onOpenAddGoal.emit()
  }

  onOpenStatusCard(goal: GoalData) {
    this.goalService.updateGoal.set(goal)
    this.onOpenStatus.emit()
  }

  onOpenUpdateCard(goal: GoalData) {
    this.goalService.updateGoal.set(goal)
    this.onOpenUpdateGoal.emit()
  }

  constructor() {
    effect(() => {
      const userId = this.userService.userId()
      const refresh = this.goalService.refreshSignal()

      if (userId) {
        this.loadData(userId)
      }
    })
  }

  loadData(userId: string) {
    this.goalService.getGoals(userId).subscribe({
      next: res => {
        this.goalList.set(res.result)
      },
      error: err => {
        console.error(err.err)
      }
    })
  }


}
