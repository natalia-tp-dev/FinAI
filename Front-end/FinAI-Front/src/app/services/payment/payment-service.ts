import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { PaymentData } from '../../interfaces/data/payment-data';
import { PaymentResponse } from '../../interfaces/response/payment-response';
import { SuccessResponse } from '../../interfaces/response/success-response';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  /** HTTP client used to communicate with the payment API */
  private http = inject(HttpClient);

  /** Base payment API URL */
  private URL = environment.gateWayUrl;

  /**
   * Generates a payment request for the selected plan.
   * @param data Payment information including user and plan details
   * @returns Observable containing the payment response
   */
  generatePayment(data: PaymentData): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${this.URL}/pay`,
      data,
      {withCredentials: true}
    );
  }

  initializeUser(): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(`${this.URL}/payments/create-free-account`, {}, {withCredentials: true})
  }
}
