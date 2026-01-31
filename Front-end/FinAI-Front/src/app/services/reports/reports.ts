import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IndividualReportResponse } from '../../interfaces/data/ai-model';

@Injectable({
  providedIn: 'root',
})

export class Reports {
  private http = inject(HttpClient)
  private URL = `ai/reports`

  getReport(goal_id: number): Observable<IndividualReportResponse> {
    return this.http.get<IndividualReportResponse>(`${this.URL}/get-report/${goal_id}`, {withCredentials: true})
  }
}
