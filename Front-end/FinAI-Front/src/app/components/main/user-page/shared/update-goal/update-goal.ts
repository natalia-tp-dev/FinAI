import { Component, inject, OnInit, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoalService } from '../../../../../services/saving-goal/goal-service';
import { Toast } from '../../../../../services/toast/toast';

@Component({
  selector: 'app-update-goal',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './update-goal.html',
  styleUrl: './update-goal.css',
})
export class UpdateGoal implements OnInit{
  onClose = output<void>()
  private goalService = inject(GoalService)
  private alertService = inject(Toast)
  currentAmount = this.goalService.updateGoal()?.current_amount
  amount = new FormControl(0, [Validators.required])


  ngOnInit(): void {
    const currentGoal = this.goalService.updateGoal()
    if (currentGoal) {
      this.amount.setValue(currentGoal.current_amount!)
    }
  }

  closeComponent() {
    this.onClose.emit()
  }

  update() {
    this.goalService.updateAmount(this.goalService.updateGoal()?.id!, this.amount.value!).subscribe({
      next: () => {
        this.alertService.success('You goal has been updated.')
        this.goalService.notifyChanges()
      }
    })
  }
}
