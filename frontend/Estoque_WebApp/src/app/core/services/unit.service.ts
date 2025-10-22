import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Unit } from '../../shared/models/unit';

@Injectable({
  providedIn: 'root'
})

export class UnitService {
   unitLink: string = '';

  constructor(private http: HttpClient) { 
    this.unitLink = environment.API_URL+"/product"
  }

  public getUnitByBatch(batch: string): Observable<Unit> {
    return this.http.get<Unit>(this.unitLink+"/batch/"+batch);
  }

  public updateUnit(id: string, data: any) {
    return this.http.put(`${this.unitLink}/units/${id}`, data);
  } 
}