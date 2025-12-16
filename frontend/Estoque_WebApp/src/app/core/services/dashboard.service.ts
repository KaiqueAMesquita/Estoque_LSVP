import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Unit } from '../../shared/models/unit';
import { Page } from '../../shared/models/page';
import { ExpiringProducts } from '../../shared/models/expiring-products';
import { TotalSpent } from '../../shared/models/total-spent';
import { TotalStock } from '../../shared/models/total-stock';
import { ExpiringBatchs } from '../../shared/models/expiring-batchs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiUrl = environment.api_url;
  constructor(private http: HttpClient) { }

  //ESTOQUE
  getTotalExpiringProducts(days: number = 30): Observable<ExpiringProducts> {
    let params = new HttpParams()
      .set('days', days.toString());
    return this.http.get<ExpiringProducts>(`${this.apiUrl}/reports/expiring-total`, { params });
  }
  
  getTotalSpent(month: number, year:number): Observable<TotalSpent>{
    let params = new HttpParams()
    .set('month', month.toString())
    .set('year', year.toString());

    return this.http.get<TotalSpent>(`${this.apiUrl}/reports/total-spent`, {params});

  }

  getStockTotal(): Observable<TotalStock>{
    return this.http.get<TotalStock>(`${this.apiUrl}/reports/stock-total`)
  }

  getExpringBatchs(days: number, page: number = 1, limit: number=20): Observable<Page<ExpiringBatchs>>{
    let pageNumber = page + 1;
    let params = new HttpParams()
    .set('daysUntilExpiry', days.toString())
    .set('page',pageNumber.toString())
    .set('limit', limit.toString());

    return this.http.get<Page<ExpiringBatchs>>(`${this.apiUrl}/reports/expiring-lots`, {params});
  }


  
  
  


    

}
