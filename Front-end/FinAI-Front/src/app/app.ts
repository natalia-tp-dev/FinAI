import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos'


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  protected readonly title = signal('FinAI-Front');
  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      AOS.init({
        duration:1000,
        once: true,
        mirror: false
      })
    }
  }

}
