import { Component, inject, OnInit, signal } from '@angular/core';
import { Icon } from "../../../landing-page/shared/icon/icon";
import { User } from '../../../../../services/user/user';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [Icon, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private userService = inject(User)
  username = signal<string>('')
  email = signal<string>('')
  isCollapsed = signal<boolean>(true)

  ngOnInit(): void {
    this.setUserInfo()
  }
  
  //Rendering user's email and name with username and email state
  private setUserInfo() {
    this.userService.getProfile().subscribe({
      next: ( user => {
        this.username.set(user.full_name)
        this.email.set(user.email)
      })
    })
  }

  //Collapsing sidebar, changing isCollapsed state
  collapse() {
    this.isCollapsed.update(val => !val)
  }
}
