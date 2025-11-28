import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Page } from './../../shared/models/page';
import { Unit } from './../../shared/models/unit';
import { KitchenUnit } from '../../shared/models/kitchen-unit';

@Injectable({
  providedIn: 'root'
})
export class DashboardCookService {
  apiUrl = ''
  constructor(private http: HttpClient) {
    this.apiUrl = environment.API_URL;
   }

  //COZINHA
  productInChicken(): Observable<Unit> {
    return this.http.get<Unit>(`${this.apiUrl}/dashboard/kitchen/product-count`);
  }

  chickenInProductsExpiringSoon(thresholdDays: number = 7, page: number = 1, limit: number = 20): Observable<any> {
    const pageNumber = page + 1; 
    let params = new HttpParams()
      .set('thresholdDays', thresholdDays.toString())
      .set('page', pageNumber.toString())
      .set('limit', limit.toString());
    return this.http.get<any>(`${this.apiUrl}/kitchen/units/expiring-soon`, { params });
  }

  kitchenUnits(page: number = 1, limit: number = 20): Observable<Page<KitchenUnit>> {
    const pageNumber = page + 1; 
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', limit.toString());
    return this.http.get<Page<KitchenUnit>>(`${this.apiUrl}/kitchen/units`, { params });
  }



}
