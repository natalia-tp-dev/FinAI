import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { Sidebar } from "../../shared/sidebar/sidebar";
import { Header } from "../../shared/header/header";
import { RouterOutlet } from "@angular/router";
import { AddTransaction } from "../../shared/add-transaction/add-transaction";
import { AddCategory } from "../../shared/add-category/add-category";

@Component({
  selector: 'app-user-page',
  imports: [Sidebar, Header, RouterOutlet, AddTransaction, AddCategory],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
})

export class UserPage {
  isTransactionCardVisible = signal<boolean>(false)
  isCategoryCardVisible = signal<boolean>(false)

  toggleForm(status:boolean, component:WritableSignal<boolean>) {
    component.set(status)
  } 

}
