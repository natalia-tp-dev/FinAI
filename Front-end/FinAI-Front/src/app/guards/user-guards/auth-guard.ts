import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { catchError, map, of } from 'rxjs';

/**
 * Auth Guard
 * -----------
 * Protects routes that require an authenticated user.
 * It also handles redirection based on the user's subscription plan.
 *
 * Responsibilities:
 * - Redirect unauthenticated users to the landing page
 * - Redirect users without an active plan to the pricing page
 * - Prevent users with an active plan from accessing the pricing page
 * - Gracefully handle errors to avoid blocking navigation
 */
export const authGuard: CanActivateFn = (route, state) => {

  /**
   * AuthService instance used to validate user session
   */
  const authService = inject(AuthService);

  /**
   * Router instance used to create redirection UrlTrees
   */
  const router = inject(Router);

  /**
   * The guard relies on confirmUser(), which must emit
   * at least one value and complete in order for the Router
   * to continue navigation.
   */
  return authService.confirmUser().pipe(

    /**
     * Maps the authenticated user state to a routing decision.
     * The guard must always return:
     * - true (allow navigation), or
     * - UrlTree (redirect)
     */
    map(user => {

      // If the user is not logged in, redirect to landing page
      if (!user.isLogged) {
        return router.createUrlTree(['/']);
      }

      // If the user is logged in but has no active plan,
      // redirect to pricing page (unless already there)
      if (!user.hasPlan && state.url !== '/pricing') {
        return router.createUrlTree(['/pricing']);
      }

      // If the user has an active plan and tries to access pricing,
      // redirect to the user dashboard
      if (user.hasPlan && state.url === '/pricing') {
        return router.createUrlTree(['/user-page']);
      }

      // All conditions satisfied → allow navigation
      return true;
    }),

    /**
     * Error handling
     * --------------
     * Ensures the guard never blocks navigation due to
     * unexpected errors (network, server, parsing issues, etc.)
     *
     * In case of error, the user is redirected to the landing page.
     */
    catchError(() => {
      return of(router.createUrlTree(['/']));
    })
  );
};
