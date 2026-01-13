import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card3d',
  imports: [NgOptimizedImage],
  templateUrl: './card3d.html',
  styleUrl: './card3d.css',
})
export class Card3d {

  /** Reference to the host element */
  private el = inject(ElementRef);

  /** Card element reference */
  @ViewChild('card') card!: ElementRef;

  /**
   * Applies a 3D tilt effect based on mouse position.
   * @param event Mouse move event
   */
  onMove(event: MouseEvent): void {
    const card = this.el.nativeElement.querySelector('.card');
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 8;
    const rotateY = -(x - centerX) / 8;

    card.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;
  }

  /**
   * Resets the card transform when the mouse leaves.
   */
  reset(): void {
    const card = this.card.nativeElement;
    card.style.transform = `
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  }
}
