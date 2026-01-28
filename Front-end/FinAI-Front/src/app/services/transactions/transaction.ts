import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Transaction, TransactionData, TransactionResponse } from '../../interfaces/data/transaction-data';
import { Observable, tap } from 'rxjs';
import { SuccessResponse } from '../../interfaces/response/success-response';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  
  private http = inject(HttpClient)
  private URL = environment.gateWayUrl
  public refreshSignal = signal<number>(0)
  public transactionToEdit = signal<Transaction | null>(null)


  notifyChanges() {
    this.refreshSignal.update(val => val +1)
  }

  getTransactions(userId: string, page: number = 1, limit: number = 10): Observable<TransactionResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<TransactionResponse>(`${this.URL}/transactions/get-transactions/${userId}`, { params });
  }

  setTransactionToEdit(transaction:Transaction) {
    this.transactionToEdit.set(transaction)
  }

  updateTransaction(id: number, data: TransactionData): Observable<SuccessResponse> {
    return this.http.put<SuccessResponse>(`${this.URL}/transactions/update-transaction/${id}`, data)
  }

  createTransaction(data: TransactionData):Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this.URL}/transactions/create-transaction`, data)
  }

  deleteTransaction(id: number | null): Observable<SuccessResponse> {
    return this.http.delete<SuccessResponse>(`${this.URL}/transactions/delete-transaction/${id}`)
  }

}
