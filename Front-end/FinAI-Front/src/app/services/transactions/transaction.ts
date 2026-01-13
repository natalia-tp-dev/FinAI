import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { TransactionData } from '../../interfaces/data/transaction-data';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../../interfaces/response/success-response';

@Injectable({
  providedIn: 'root',
})
export class Transaction {
  
  private http = inject(HttpClient)
  private URL = environment.gateWayUrl
  public categoryIdSignal = signal<string>('')

  getTransaction():Observable<TransactionData> {
    return this.http.get<TransactionData>('/transactions/')
  }

  createTransaction(data: TransactionData):Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this.URL}/transactions/create-transaction`, data)
  }


}
