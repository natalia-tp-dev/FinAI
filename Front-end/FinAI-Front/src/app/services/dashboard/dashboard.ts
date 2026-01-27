import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MultiSeriesData } from '../../interfaces/data/transaction-data';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly URL = `${environment.gateWayUrl}/transactions`
  private http = inject(HttpClient)

  getYearlyTrend(user_id: string): Observable<MultiSeriesData[]> {
    return this.http.get<MultiSeriesData[]>(`${this.URL}/get-yearly-trend/${user_id}`);
  }

  getCategoriesExpenses(user_id: string): Observable<{labels: string[], values: number[]}> {
    return this.http.get<{labels: string[], values: number []}>(
      `${this.URL}/get-categories-expenses/${user_id}`
    )
  }

  getTotalBalance(user_id: string): Observable<Number> {
    return this.http.get<Number>(`${this.URL}/get-total-balance/${user_id}`)
  }
}
