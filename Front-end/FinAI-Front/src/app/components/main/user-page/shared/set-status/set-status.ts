import { Component, inject, output } from '@angular/core';
import { GoalService } from '../../../../../services/saving-goal/goal-service';
import { Toast } from '../../../../../services/toast/toast';

@Component({
  selector: 'app-set-status',
  imports: [],
  templateUrl: './set-status.html',
  styleUrl: './set-status.css',
})
export class SetStatus {
  
  onClose = output<void>()
  private goalService = inject(GoalService)
  private alertService = inject(Toast)

  updateStatus(status: string) {
    this.goalService.updateStatus(this.goalService.updateGoal()?.id!, status).subscribe({
      next: () => {
        this.alertService.success('The status has been succesfully updated')
        this.goalService.notifyChanges()
        this.closeComponent()
      },
      error: err => {
        console.error(err.err)
      }
    })
  }

  closeComponent() {
    this.onClose.emit()
  }
}
