import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { InputMovement } from '../../shared/models/inputMovement';
import { Movement } from '../../shared/models/movement';
import { Page } from '../../shared/models/page';
import { Consumption } from '../../shared/models/consumption';
@Injectable({
  providedIn: 'root'
})
export class MovementService {
  movementLink: string = '';
  constructor(private http: HttpClient) { 
    this.movementLink = environment.api_url + "/movement"
  }

  createInputMovement(movement: InputMovement): Observable<InputMovement> {
    return this.http.post<any>(`${this.movementLink}/inputs`, movement);
  } 

 
  // Método para pegar todos Movements
  public getAllMovements(page: number = 1, limit: number = 20, sort: string = 'date,desc'): Observable<Page<Movement>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort);

    return this.http.get<Page<Movement>>(this.movementLink, { params });
  }
  
  // Método para pegar um Movement pelo id
  public getMovementById(movementId: number): Observable<Movement> {
    return this.http.get<Movement>(`${this.movementLink}/${movementId}`);
  }

  public consumptionMovement(comsuption: Consumption): Observable<Movement> {
    return this.http.post<Movement>(`${this.movementLink}/consumption`, comsuption);
  }

  // Método para atualizar um Movement
  public updateMovement(movementId: number, movement: Partial<Movement>): Observable<Movement> {
    return this.http.put<Movement>(`${this.movementLink}/${movementId}`, movement);
  }
 

}
