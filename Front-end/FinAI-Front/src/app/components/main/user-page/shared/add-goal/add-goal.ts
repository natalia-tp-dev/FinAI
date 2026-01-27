import { Component, inject, OnInit, output } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { User } from '../../../../../services/user/user';
import { AIGoalStatefulService } from '../../../../../services/ai_goal_report/ai-goal-service';
import { GoalData } from '../../../../../interfaces/data/goal-data';
import { Toast } from '../../../../../services/toast/toast';
import { GoalService } from '../../../../../services/saving-goal/goal-service';

@Component({
  selector: 'app-add-goal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-goal.html',
  styleUrl: './add-goal.css',
})
export class AddGoal implements OnInit {
  onClose = output<void>()
  public aiGoalService = inject(AIGoalStatefulService)
  private userService = inject(User)
  private alertService = inject(Toast)
  private goalService = inject(GoalService)
  goalForm!: FormGroup

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm() {
    this.goalForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'targetAmount': new FormControl(null, [Validators.required]),
      'currentAmount': new FormControl(null, [Validators.required]),
      'deadline': new FormControl(null, [Validators.required])
    })
  }

  closeComponent() {
    this.onClose.emit()
  }

  saveGoal() {
    if (this.goalForm.valid) {
      const currentUserId = this.userService.userId()

      const goalData: GoalData = {
        name: this.goalForm.value.name,
        target_amount: this.goalForm.value.targetAmount,
        current_amount: this.goalForm.value.currentAmount,
        deadline: this.goalForm.value.deadline,
        userId: currentUserId
      }

      this.aiGoalService.generateIndividualReport(goalData).subscribe({
        next: () => {
          this.alertService.success('Your goal has been succesfully created!')
          this.goalService.notifyChanges()
          this.closeComponent()
        },
        error: err => {
          console.error(err.err)
        }
      })
    }
  }
}
