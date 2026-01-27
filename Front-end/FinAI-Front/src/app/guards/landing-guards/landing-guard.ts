import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';

/**
 * Landing Guard
 * -------------
 * Prevents authenticated users from accessing public routes
 * (landing page, sign-in, sign-up).
 *
 * - Logged-in users with an active plan → user page
 * - Logged-in users without a plan → pricing
 * - Non-authenticated users → allowed
 */
export const landingGuard: CanActivateFn = () => {

  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.confirmUser().pipe(
    map(user => {
      if (user.isLogged) {
        return user.hasPlan
          ? router.createUrlTree(['/user-page'])
          : router.createUrlTree(['/pricing']);
      }
      return true;
    }),
    // Prevent navigation from being blocked in case of errors
    catchError(() => of(true))
  );
};
