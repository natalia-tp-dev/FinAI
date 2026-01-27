import { DestroyRef, inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../user/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /** Service responsible for retrieving user profile data */
  private userService = inject(User);

  /** Reference used to automatically clean up subscriptions */
  private destroyRef = inject(DestroyRef);

  /**
   * Confirms whether the user is authenticated and has an active plan.
   *
   * @returns Observable containing authentication and plan status
   */
  confirmUser(): Observable<{ isLogged: boolean; hasPlan: boolean }> {
    return this.userService.getProfile().pipe(
      takeUntilDestroyed(this.destroyRef),
      map(res => {
        const hasPlan = !!res.has_selected_plan;
        return {
          isLogged: res.isLogged,
          hasPlan
        };
      })
    );
  }

  confirmUserPlan(): Observable<{plan_type: string, is_in_trial: boolean}> {
    return this.userService.getProfile().pipe(
      map(data => {
        return {
          plan_type: data.plan_type,
          is_in_trial: data.is_in_trial
        }
      })
    )
  }
}
