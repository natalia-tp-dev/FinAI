import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { aiGuard } from './ai-guard';

describe('aiGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => aiGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
