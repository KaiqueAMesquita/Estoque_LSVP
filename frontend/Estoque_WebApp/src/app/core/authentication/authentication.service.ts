import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
   private token: string | null = null;
   private url = environment.API_URL+"/login"
   

  constructor(private router: Router, private http: HttpClient) { }

  setToken(token:string): void{
    localStorage.setItem('acessToken', token); //seta a token com a chave de acesso
  }

  getToken(): string | null {
    return this.token
  }

  //ve se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.token;; //retorno do resultado
  }
  //funcao login
  login(token: string) : void{
    this.token = token;
    this.router.navigate(['/']); // navega para a tela de home

  }
  
  //função para logout
  logout(): void{
    this.token = null;
    localStorage.removeItem('acessToken');  // remove item do storage da navegação

    this.http.post(environment.API_URL+'/logout', {}, {withCredentials: true})
    .subscribe(() =>{
      this.router.navigate(['/login']); // navega para a tela de login

    })
  }

}

