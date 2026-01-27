import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetStatus } from './set-status';

describe('SetStatus', () => {
  let component: SetStatus;
  let fixture: ComponentFixture<SetStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
