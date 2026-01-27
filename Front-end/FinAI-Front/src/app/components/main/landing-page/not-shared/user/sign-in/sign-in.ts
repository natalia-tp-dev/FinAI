import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Icon } from "../../../shared/icon/icon";
import { User } from '../../../../../../services/user/user';
import { Toast } from '../../../../../../services/toast/toast';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, Icon, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn implements OnInit {

  signInForm!: FormGroup
  private userService = inject(User)
  private alertService = inject(Toast)
  private router = inject(Router)

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    })
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.userService.signIn(this.signInForm.value).subscribe({
        next: () => {
          this.alertService.success('Signing in...')
          this.router.navigate(['/user-page']);
        },
        error: err => {
          this.alertService.error(err.error.error)
        }
      })
    }
  }
}
