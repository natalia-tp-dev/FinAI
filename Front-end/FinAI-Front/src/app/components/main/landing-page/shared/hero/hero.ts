import { Component, ChangeDetectionStrategy, OnInit, signal, AfterViewInit, inject } from '@angular/core';
import { Card3d } from "../card3d/card3d";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [Card3d, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})

export class Hero implements OnInit {
  count = signal<number>(0)
  private target = 100
  private duration = 3000

  ngOnInit(): void {
    this.animateCount()
  }

  animateCount() {
    const stepTime = this.duration / this.target;

    const interval = setInterval(() => {
      const currentCount = this.count();
      if (currentCount < this.target) {
        this.count.set(currentCount+1);
      } else {
        clearInterval(interval); 
      }
    }, stepTime);
  }

}
