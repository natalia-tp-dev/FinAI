import { Component, inject, OnInit, signal } from '@angular/core';
import { Icon } from "../../../landing-page/shared/icon/icon";
import { User } from '../../../../../services/user/user';
import { RouterLink } from "@angular/router";
import { UiService } from '../../../../../services/UI/ui-service';

@Component({
  selector: 'app-sidebar',
  imports: [Icon, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private userService = inject(User)
  private uiService = inject(UiService)
  username = signal<string>('')
  email = signal<string>('')
  isCollapsed = signal<boolean>(true)
  planType = signal<string>('')


  ngOnInit(): void {
    this.setUserInfo()
  }
  
  //Rendering user's email and name with username and email state
  private setUserInfo() {
    this.userService.getProfile().subscribe({
      next: ( user => {
        this.username.set(user.full_name)
        this.email.set(user.email)
        this.planType.set(user.plan_type)
      })
    })
  }

  //Collapsing sidebar, changing isCollapsed state
  collapse() {
    this.isCollapsed.update(val => !val)
  }

  setPageInfo(title: string, subtitle: string) {
    this.uiService.updateHeader(title, subtitle)
  }
}

