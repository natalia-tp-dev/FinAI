import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGoal } from './update-goal';

describe('UpdateGoal', () => {
  let component: UpdateGoal;
  let fixture: ComponentFixture<UpdateGoal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateGoal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateGoal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
