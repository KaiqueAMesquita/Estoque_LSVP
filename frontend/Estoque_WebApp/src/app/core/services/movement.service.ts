import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { InputMovement } from '../../shared/models/inputMovement';
@Injectable({
  providedIn: 'root'
})
export class MovementService {
  movementLink: string = '';
  constructor(private http: HttpClient) { 
    this.movementLink = environment.API_URL+"/movement"
  }


  createInputMovement(movement: InputMovement): Observable<InputMovement>{ {
    return this.http.post<any>(`${this.movementLink}/inputs`, movement);
  }
}
}
