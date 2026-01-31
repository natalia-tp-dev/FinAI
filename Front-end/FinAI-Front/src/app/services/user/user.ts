import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SignUpData } from '../../interfaces/data/sign-up-data';
import { SuccessResponse } from '../../interfaces/response/success-response';
import { ProfileData } from '../../interfaces/data/profile-data';
import { SignInData } from '../../interfaces/data/sign-in-data';

@Injectable({
  providedIn: 'root',
})
export class User {

  /** HttpClient instance for API communication */
  private http = inject(HttpClient);

  /** Base API gateway URL */
  private URL = `api`;
  private userIdSignal = signal<string>('')
  public userId = this.userIdSignal.asReadonly()

  /**
   * Registers a new user.
   * @param data User registration data
   * @returns Observable containing the sign up response
   */
  signUp(data: SignUpData): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      `${this.URL}/users/sign-up`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Authenticates a user and starts a session.
   * @param data User login credentials
   * @returns Observable containing the sign in response
   */
  signIn(data: SignInData): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      `${this.URL}/users/sign-in`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Retrieves the authenticated user's profile information.
   * @returns Observable containing the get profile response
   */
  getProfile(): Observable<ProfileData> {
    return this.http.get<ProfileData>(
      `${this.URL}/users/profile-info`,
      { withCredentials: true }
    ).pipe(
      tap ( res => this.userIdSignal.set(res.id))
    );
  }

  /**
   * Logs out the current user and ends the session.
   * @returns Observable containing the log out response
   */
  logOut(): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      `${this.URL}/users/log-out`,
      {},
      { withCredentials: true }
    );
  }
}
