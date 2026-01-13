import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Icon } from "../../../shared/icon/icon";
import { User } from '../../../../../../services/user/user';
import { Toast } from '../../../../../../services/toast/toast';

@Component({
  selector: 'app-sign-up',
  imports: [Icon, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})

export class SignUp implements OnInit {

  signUpForm!: FormGroup
  private router = inject(Router)
  private userService = inject(User)
  private toastAlert = inject(Toast)

  ngOnInit(): void {
    //Form's fields validations
    this.initializeForm()
  }

  initializeForm() {
    this.signUpForm = new FormGroup({
      'full_name': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'email': new FormControl(null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  //Creating user function
  onSubmit() {
    if (this.signUpForm.valid) {
      this.userService.signUp(this.signUpForm.value).subscribe({
        next: () => {
          console.log('Submitting info, moving to payment service now...');
          this.router.navigate(['/pricing'])
          this.toastAlert.success('Your account has been succesfully created.')
        },
        error: err => {
          console.error(err)
          this.toastAlert.error(err.error.error)
        }
      });
    }
  }
}
