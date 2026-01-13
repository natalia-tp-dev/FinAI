import { Component, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../../services/user/user';
import { Toast } from '../../../../../services/toast/toast';

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
      },
      error: err => this.alertService.error(`An error ocurred: ${err.error.error}`)
    })
  }
}
