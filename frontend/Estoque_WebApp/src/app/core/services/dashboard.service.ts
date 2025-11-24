import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Unit } from '../../shared/models/unit';
import { Page } from '../../shared/models/page';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = environment.API_URL;
  constructor(private http: HttpClient) { }

  productInChicken(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/kitchen/product-count`);
  }

  chickenInProductsExpiringSoon(thresholdDays: number = 7, page: number = 1, limit: number = 20): Observable<any> {
    const pageNumber = page + 1; 
    let params = new HttpParams()
      .set('thresholdDays', thresholdDays.toString())
      .set('page', pageNumber.toString())
      .set('limit', limit.toString());
    return this.http.get<any>(`${this.apiUrl}/kitchen/products-expiring-soon`, { params });
  }

  kitchenUnits(page: number = 1, limit: number = 20): Observable<Page<Unit>> {
    const pageNumber = page + 1; 
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', limit.toString());
    return this.http.get<Page<Unit>>(`${this.apiUrl}/kitchen/units`, { params });
  }



  productInStock(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stock/product-count`);
  }


    

}
