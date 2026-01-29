import { Component, inject, OnInit, signal } from '@angular/core';
import { PaymentService } from '../../../../../../services/payment/payment-service';
import { environment } from '../../../../../../../environments/environment.development';
import { PaymentData } from '../../../../../../interfaces/data/payment-data';
import { Router } from '@angular/router';
import { User } from '../../../../../../services/user/user';
import { Toast } from '../../../../../../services/toast/toast';
declare var paypal: any

@Component({
  selector: 'app-pricing',
  imports: [],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export class Pricing implements OnInit {

  private payment = inject(PaymentService)
  private userService = inject(User)
  private userID = signal<string>('');
  private router = inject(Router)
  private alertService = inject(Toast)
  private PLAN_PREMIUM_ID = environment.PLAN_PREMIUM_ID


  ngOnInit(): void {
    this.loadUserInfo()
    //Updating user id with getId method
    this.updateId()
    //Rendering paypal buttons
    setTimeout(() => {
      this.renderPaypalButton(this.PLAN_PREMIUM_ID, '#paypal-button-premium', 'PREMIUM');
    }, 2000);
  }

  private loadUserInfo() {
    this.userService.getProfile().subscribe()
  }

  private updateId() {
    this.userID.set(this.userService.userId())
  }

  private renderPaypalButton(planId: string, containerId: string, planType: string,) {
    //Creating subscription and payment with paypal buttons
    paypal.Buttons({
      createSubscription: (data: any, actions: any) => {
        console.log(planId + ' ' + planType);
        return actions.subscription.create({
          'plan_id': planId
        })
      },
      onApprove: (data: any, actions: any) => {
        const currentId = this.userService.userId()

        const payload: PaymentData = {
          subscriptionId: data.subscriptionID,
          plan_type: planType
        }
        //Payment service from payment-service-container
        this.payment.generatePayment(payload).subscribe({
          next: () => {
            this.alertService.success(`Your ${planType} plan has been activated`)
            this.router.navigate(['/user-page'])
          },
          error: () => this.alertService.error('Something went wrong!')
        })
      }
    }).render(containerId)
  }

  submitFreeInfo() {
    this.payment.initializeUser().subscribe({
      next: res => {
        this.alertService.success(res.message)
        this.router.navigate(['/'])
      }
    })
  }
}
