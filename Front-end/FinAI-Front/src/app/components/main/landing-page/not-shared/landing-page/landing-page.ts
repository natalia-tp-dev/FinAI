import { AfterViewInit, Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { Hero } from "../../shared/hero/hero";
import { Features } from "../../shared/features/features";
import { NavigationStart, Router } from '@angular/router';
import { Navigation } from "../../shared/navigation/navigation";
import { LearnMore } from "../../shared/learn-more/learn-more";
import { filter } from 'rxjs';


@Component({
  selector: 'app-landing-page',
  imports: [Hero, Features, Navigation, LearnMore],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements AfterViewInit {

  /** 
   * References to all elements in the template
   * These sections are observed to update URL fragment
  */
  @ViewChildren('section') sections!: QueryList<ElementRef<HTMLElement>>

  /**
   * Router instance used to listen to navigation events
   */
  private router = inject(Router)

  /**
   * Signal used to detect when navigation is triggered manually 
   * (e.g. clicking links)
   */
  private isManualScrolling = signal<boolean>(false)

  /**
   * Timeout reference used to reset the manual scrolling state
   */
  private scrollTimeout: any

  /**
   * Listens to navigation events
   * When a navigation starts, scrolling updates are temporarily disabled
   * to prevent IntersectionObserver to overridign the URL fragment
   */
  handlingRoute() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.isManualScrolling.set(true)

      if (this.scrollTimeout) clearTimeout(this.scrollTimeout)

      this.scrollTimeout = setTimeout(() => {
        this.isManualScrolling.set(false)
      }, 300)
    });
  }

  /**
   * Observes section visibility using IntersectionObserver.
   * When a section becomes visible, the URL fragment is updated
   * without adding a new entry to the browser history.
   */
  replacingURL() {
    const observer = new IntersectionObserver(entries => {
      if (this.isManualScrolling()) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.router.navigate([], {
            fragment: entry.target.id,
            replaceUrl: true
          });
        }
      });
    }, { threshold: 0.7 });

    this.sections.forEach(s => observer.observe(s.nativeElement));
  }

  /**
   * Initializes route handling logic as soon as the component is created.
   */
  constructor() {
    this.handlingRoute()
  }

  /**
   * Starts observing sections once the view has been fully initialized.
   */
  ngAfterViewInit(): void {
    this.replacingURL()
  }

}
