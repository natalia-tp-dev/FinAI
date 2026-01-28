import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { IndividualReportResponse } from '../../interfaces/data/ai-model';
import { GoalData } from '../../interfaces/data/goal-data';
import { SuccessResponse } from '../../interfaces/response/success-response';

@Injectable({
  providedIn: 'root',
})
export class AIGoalStatefulService {
  private URL = `${environment.gateWayUrl}/ai`
  private http = inject(HttpClient)
  public isGenerating = signal<boolean>(false)

  generateIndividualReport( data:GoalData ): Observable<SuccessResponse> {
    this.isGenerating.set(true)
    return this.http.post<SuccessResponse>(`${this.URL}/create-and-analyze`, data).pipe(
      tap(() => {
        this.isGenerating.set(false)
      }),
      catchError((error) => {
        this.isGenerating.set(false);
        throw error;
      })
    )
  }
}
