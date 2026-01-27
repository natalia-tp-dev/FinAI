import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { Sidebar } from "../../shared/sidebar/sidebar";
import { Header } from "../../shared/header/header";
import { RouterOutlet } from "@angular/router";
import { AddTransaction } from "../../shared/add-transaction/add-transaction";
import { AddCategory } from "../../shared/add-category/add-category";
import { Transactions } from '../../shared/transactions/transactions';
import { AddGoal } from "../../shared/add-goal/add-goal";
import { SavingGoals } from '../../shared/saving-goals/saving-goals';
import { SetStatus } from "../../shared/set-status/set-status";
import { UpdateGoal } from "../../shared/update-goal/update-goal";

@Component({
  selector: 'app-user-page',
  imports: [Sidebar, Header, RouterOutlet, AddTransaction, AddCategory, AddGoal, SetStatus, UpdateGoal],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
})

export class UserPage {
  isTransactionCardVisible = signal<boolean>(false)
  isCategoryCardVisible = signal<boolean>(false)
  isGoalCardVisible = signal<boolean>(false)
  isStatusCardVisible = signal<boolean>(false)
  isUpdateGoalCarVisible = signal<boolean>(false)

  toggleForm(status:boolean, component:WritableSignal<boolean>) {
    component.set(status)
  } 

  onRouteActivate(componentRef:any) {
    if (componentRef instanceof Transactions) {
      componentRef.onOpen.subscribe(() => {
        this.toggleForm(true, this.isTransactionCardVisible)
      })
    } else if (componentRef instanceof SavingGoals) {
      componentRef.onOpenAddGoal.subscribe(() => {
        this.toggleForm(true, this.isGoalCardVisible)
      })
      componentRef.onOpenStatus.subscribe(() => {
        this.toggleForm(true, this.isStatusCardVisible)
      })
      componentRef.onOpenUpdateGoal.subscribe(() => {
        this.toggleForm(true, this.isUpdateGoalCarVisible)
      })
    }
  }
}
