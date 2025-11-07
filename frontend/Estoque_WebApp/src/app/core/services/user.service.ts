import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Page } from '../../shared/models/page';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userLink: string = '';
  constructor(private http: HttpClient) { 
    this.userLink = environment.API_URL+"/user"
  }
  
  //Método para registrar um usuário
  public registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.userLink, user);

}

    //Método para pegar todos usuários
  public getAllUsers(page: number = 1, limit: number = 20, sort: string = 'id,desc', name?: string): Observable<Page<User>> {
    const pageNumber = page + 1; // O backend espera a página começando em 1
    let params = new HttpParams()
      .set('page', pageNumber.toString())
      .set('limit', limit.toString());

    if (name && name.trim() !== '') {
      params = params.set('name', name);
    }

    return this.http.get<Page<User>>(this.userLink, { params });
  }

  //Método para pegar um usuário pelo id
  public getUserById(userId: number): Observable<User> {
    return this.http.get<User>(this.userLink+"/"+userId);
  }

  public getUserByName(userName: string): Observable<User> {
    return this.http.get<User>(this.userLink+"/n/"+userName);
  }

  //Método para atualizar um usuário
  public updateUser(userId: number, user: User): Observable<User> {
     return this.http.put<User>(this.userLink + "/" + userId, user);
  }
    //Método para deletar um usuário
  public deleteUser(userId: number): Observable<User> {	
    return this.http.delete<User>(this.userLink+"/"+userId);
      
  }


}