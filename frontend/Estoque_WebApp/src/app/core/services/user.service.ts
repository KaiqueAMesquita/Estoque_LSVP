import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userLink: string = '';
  constructor(private http: HttpClient) { 
    this.userLink = environment.API_URL+"/user"
  }
  
  //Método para registrar um usuário
  public registerUser(user: User): void{
    this.http.post<Observable<User>>(this.userLink, user).subscribe(
      (response) => {
        console.log('Usuário registrado com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao registrar usuário:', error);
      }
    );
  }
    //Método para pegar todos usuários
  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userLink);
  }

  //Método para pegar um usuário pelo id
  public getUserById(userId: number): Observable<User> {
    return this.http.get<User>(this.userLink+"/"+userId);
  }

  //Método para atualizar um usuário
  public updateUser(userId: number, user: Partial<User>): void {
     this.http.put<User>(this.userLink+"/update/"+userId, user).subscribe(
      (response) => {
        console.log('Usuário atualizado com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao atualizar usuário:', error);
      }
    );
  }
    //Método para deletar um usuário
  public deleteUser(userId: number): void {	
    this.http.delete<User>(this.userLink+"/"+userId).subscribe(
      (response) => {
        console.log('Usuário deletado com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao deletar usuário:', error);
      } 
    );
  
  }


}