import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Unit } from '../../shared/models/unit';
import { Page } from '../../shared/models/page';
import { Transfer } from './../../shared/models/transfer';

@Injectable({
  providedIn: 'root'
})

export class UnitService {
   unitLink: string  = "";

  constructor(private http: HttpClient) { 
    this.unitLink = environment.API_URL+"/unit"
  }

  public getAllUnits(page : number = 0, limit: number = 20, sort: string = 'id,desc', productId?: number, batch?: string): Observable<Page<Unit>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort.toString());
    if (productId) {
      params = params.set('productId', productId.toString());
    }
    if (batch) {
      params = params.set('batch', batch.toString());
    }
    return this.http.get<Page<Unit>>(this.unitLink, { params });

  }
  

  public getUnitByBatch(batch: string): Observable<Unit> {
    return this.http.get<Unit>(this.unitLink+"/batch/"+batch);
  }

  public getUnitById(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${this.unitLink}/${id}`);
  }


  public updateUnit(id: string, data: any) {
    return this.http.put(`${this.unitLink}/${id}`, data);
  } 

  public deleteUnit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.unitLink}/${id}`);
  }

  public transferUnit(transfer: Transfer): Observable<Unit> {
   
    return this.http.post<Unit>(`${environment.API_URL}/movement/transfers`, transfer);
  }




}