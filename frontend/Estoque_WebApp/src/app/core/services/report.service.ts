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


  getStockReport(location: string): Observable<Blob> {
    const params = new HttpParams().set('location', location);
    return this.http.get(`${this.urlLink}/pdf/stock-report`, { params, responseType: 'blob' });
  }

  // 2. Relatório de Origem (Doação vs Compra)
  getSourceReport(month: number, year: number): Observable<Blob> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.get(`${this.urlLink}/pdf/source-report`, { params, responseType: 'blob' });
  }

  // 3. Relatório de Risco (Vencimento)
  getRiskReport(): Observable<Blob> {
    return this.http.get(`${this.urlLink}/pdf/risk-report`, { responseType: 'blob' });
  }

  // 4. Relatório de Custos Mensais
  getExpensesReport(year: number): Observable<Blob> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get(`${this.urlLink}/pdf/expenses-report`, { params, responseType: 'blob' });
  }

  // 5. Extrato Detalhado de Doações
  getDonationsReport(month: number, year: number): Observable<Blob> {
    const params = new HttpParams()
      .set('month', month.toString())
      .set('year', year.toString());
    return this.http.get(`${this.urlLink}/pdf/donations-report`, { params, responseType: 'blob' });
  }

  // 6. Relatório de Cobertura
  getCoverageReport(): Observable<Blob> {
    return this.http.get(`${this.urlLink}/pdf/coverage-report`, { responseType: 'blob' });
  }

  // --- Utilitário para baixar o arquivo no navegador ---
  downloadFile(data: Blob, filename: string) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }


}
