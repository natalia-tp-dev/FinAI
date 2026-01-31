import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GoalData, GoalResponse } from '../../interfaces/data/goal-data';
import { SuccessResponse } from '../../interfaces/response/success-response';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private URL = `api/ai`
  private http = inject(HttpClient)
  public updateGoal = signal<GoalData | null>(null)
  public refreshSignal = signal<number>(0)

  notifyChanges() {
    this.refreshSignal.update(val => val + 1)
  }

  getGoals(userId: string): Observable<GoalResponse> {
    return this.http.get<GoalResponse>(`${this.URL}/get-saving-goals/${userId}`)
  }

  updateAmount(goal_id: number, amount: number): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(
      `${this.URL}/update-amount/${goal_id}`,
      { amount } 
    );
  }

  updateStatus(goal_id: number, status: string): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(`${this.URL}/update-status/${goal_id}`, {status})
  }
}
