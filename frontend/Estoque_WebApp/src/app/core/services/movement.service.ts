import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { InputMovement } from '../../shared/models/inputMovement';
import { Movement } from '../../shared/models/movement';

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

 
    // Método para pegar todos Movements
    public getAllMovements(): Observable<Movement[]> {
      return this.http.get<Movement[]>(this.movementLink);
    }
    //Ver se após o merge:
    //public com ts1128, Descobrir o porque é  
  
    // Método para pegar um Movement pelo id
    public getMovementById(MovementId: number): Observable<Movement> {
      return this.http.get<Movement>(`${this.movementLink}/${MovementId}`);
    }
  
    // Método para atualizar um Movement
    public updateMovement(MovementId: number, Movement: Partial<Movement>): Observable<Movement> {
      return this.http.put<Movement>(`${this.movementLink}/${MovementId}`, Movement);
    }
  
    // Método para deletar um Movement
    public deleteMovement(MovementId: number): void {
      this.http.delete<Movement>(`${this.movementLink}/${MovementId}`).subscribe(
        (response) => {
          console.log('Movimentação deletado com sucesso:', response);
        },
        (error) => {
          console.error('Erro ao deletar Movimentação:', error);
        }
      );
    }
}
