import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card3d } from './card3d';

describe('Card3d', () => {
  let component: Card3d;
  let fixture: ComponentFixture<Card3d>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card3d]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Card3d);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
