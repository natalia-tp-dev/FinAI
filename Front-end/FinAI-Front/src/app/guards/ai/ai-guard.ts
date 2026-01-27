import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { map } from 'rxjs';

export const aiGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.confirmUserPlan().pipe(
    map(userPlan => {
      if (userPlan.plan_type === 'FREE') {
        router.navigate(['/']);
        return false;
      }
      return true;
    })
  );
};