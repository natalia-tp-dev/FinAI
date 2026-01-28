import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { CategoryData } from '../../interfaces/data/category-data';
import { SuccessResponse } from '../../interfaces/response/success-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Category {

  /** HTTP client used to communicate with the backend API */
  private http = inject(HttpClient);

  /** Base API URL */
  private URL = environment.gateWayUrl;

  private categoriesSignal = signal<CategoryData[]>([]) 
  public categories = this.categoriesSignal.asReadonly()

  /**
   * Creates a new category.
   * @param data Category information to be created
   * @returns Observable containing a success response
   */
  createCategory(data: CategoryData): Observable<SuccessResponse> {
    return this.http.post<SuccessResponse>(
      `${this.URL}/categories/create-category`,
      data
    ).pipe(
      tap (() => {
        this.getCategories(data.user_id!).subscribe()
      })
    );
  }

  /**
   * Retrieves all user categories.
   * @returns Observable list of categories
   */
  getCategories(userId:string): Observable<CategoryData[]> {
    const params = new HttpParams().set('userId', userId)

    return this.http.get<CategoryData[]>(
      `${this.URL}/categories/get-categories`,
      {params}
    ).pipe(
      tap ( data => this.categoriesSignal.set(data))
    )
  }
}
