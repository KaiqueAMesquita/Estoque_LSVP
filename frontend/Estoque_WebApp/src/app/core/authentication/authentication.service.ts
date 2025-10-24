import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { throwError, Observable, tap } from 'rxjs'; 
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //define a URL para o endpoint de login
   private url: string = environment.API_URL+"/auth/login"
   private refreshUrl: string = environment.API_URL + "/auth/refresh";
   

  constructor(private router: Router, private http: HttpClient) { }

  //função para setar o token no localStorage
  setToken(token:string): void{
    localStorage.setItem('accessToken', token); //seta a token com a chave de acesso
  }

  //função para obter o token do localStorage
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  //ve se o usuário está autenticado
  isAuthenticated(): boolean {
  const token = this.getToken();
  return !!token && token.trim() !== '';//verifica se o token existe e não está vazio
}
  //funcao login
   login(credentials: { name: string; password: string }): Observable<any> {
  return this.http.post(this.url, credentials, { withCredentials: true });
  }

  //função para refresh do token
  refreshToken(): Observable<any> {
    const token = this.getToken();
    // O backend espera o token no header para o refresh
    return this.http.post(this.refreshUrl, {}).pipe(
      tap((response: any) => {
        this.setToken(response.token);
      }));
  }
  
  //função para logout
  logout(): void{
    localStorage.removeItem('accessToken');  // remove item do storage da navegação
    this.router.navigate(['/login']);
    this.http.post(environment.API_URL+'/auth/logout', {}, {withCredentials: true})
    .subscribe(() =>{
      this.router.navigate(['/login']); // navega para a tela de login

    })
  }

  //função para pegar o username do usuário
  userIsAdmin(): boolean {
    const token = this.getToken();
    if (!token) {
      return false; // Retorna false se o token não existir
    }
    try {
      const payload = this.decodeToken(); // Decodifica o token JWT
      return payload.role === "ADMINISTRADOR"; // Retorna true se admin for true, senão false
    } catch {
      return false;
    }
  }

  //decodifica o token JWT para obter o payload
  decodeToken(): any {
    const token = this.getToken();
    if (!token) {
      return null; // Retorna null se o token não existir
    }
    try {
      return JSON.parse(atob(token.split('.')[1])); // Decodifica o token JWT
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }
  getUserName(): string {
    const token = this.getToken();
      if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || '';
    // não sei se existe uma maneira melhor de fazer isso.
  }
}