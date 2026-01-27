import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Icon } from "../icon/icon";

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, Icon],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {

    /**
   * Controls sidebar visibility (mobile menu)
   */
  isSideBarOpened = signal<boolean>(false);

  /**
   * Toggles sidebar open/close state
   */
  toggleMenu(): void {
    this.isSideBarOpened.update(state => !state);
  }

  /**
   * Tracks if the window has been scrolled
   */
  isScrolled = signal<boolean>(false);

  /**
   * Listens to window scroll to apply navbar styles
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled.update(() => window.scrollY > 10);
  }


}
