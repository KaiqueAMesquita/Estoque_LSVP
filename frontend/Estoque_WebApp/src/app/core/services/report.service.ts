import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { StockFlow } from '../../shared/models/stock-flow';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
   urlLink: string;

  constructor(private http: HttpClient) { 
    this.urlLink = environment.API_URL + "/reports";
  }

  getStockFlow(categoryId: number, startMonth: number, startYear: number, endMonth: number, endYear: number): Observable<StockFlow> {
    let params = new HttpParams()
      .set('categoryId', categoryId.toString())
      .set('startMonth', startMonth.toString())
      .set('startYear', startYear.toString())
      .set('endMonth', endMonth.toString())
      .set('endYear', endYear.toString());
    return this.http.get<StockFlow>(`${this.urlLink}/stock-flow`, { params });
  }


}
