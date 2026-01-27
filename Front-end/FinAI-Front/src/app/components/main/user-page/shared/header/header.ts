import { Component, inject, OnInit, output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../../services/user/user';
import { Toast } from '../../../../../services/toast/toast';
import { UiService } from '../../../../../services/UI/ui-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private userService = inject(User)
  private alertService = inject(Toast)
  private router = inject(Router)
  private uiService = inject(UiService)

  title = this.uiService.title
  subtitle = this.uiService.subTitle

  onAddTransaction = output<void>()

  openCard() {
    this.onAddTransaction.emit()
  }

  //Sign out service with click action
  signOut() {
    this.userService.logOut().subscribe({
      next: () => {
        this.alertService.success('Succesfully logged out')
        this.router.navigate(['/'])
      }
    })
  }
}
