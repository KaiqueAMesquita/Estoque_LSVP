import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
   private url: string = environment.API_URL+"/auth/login"
   

  constructor(private router: Router, private http: HttpClient) { }

  setToken(token:string): void{
    localStorage.setItem('acessToken', token); //seta a token com a chave de acesso
  }

  getToken(): string | null {
    return localStorage.getItem('acessToken');
  }

  //ve se o usuário está autenticado
  isAuthenticated(): boolean {
  const token = this.getToken();
  return !!token && token.trim() !== '';
}
  //funcao login
   login(form: FormGroup): void {
    this.http.post(this.url, form.value, { withCredentials: true })
      .subscribe((res: any) => {
        try{
        this.setToken(res.token);
        this.router.navigate(['/']);
        }catch (error) {
          console.error('Erro ao processar o token:', error);
          throwError(() => new Error('Erro ao processar o token'));
        }
      });
  }
  
  //função para logout
  logout(): void{
    localStorage.removeItem('acessToken');  // remove item do storage da navegação
    this.router.navigate(['/login']);
    this.http.post(environment.API_URL+'/auth/logout', {}, {withCredentials: true})
    .subscribe(() =>{
      this.router.navigate(['/login']); // navega para a tela de login

    })
  }

}

