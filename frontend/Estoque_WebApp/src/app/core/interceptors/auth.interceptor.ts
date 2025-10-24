import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EMPTY, throwError } from 'rxjs';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //injeta o serviço de autenticação
  const authService = inject(AuthenticationService);
  //obtem o token de autenticação
  const token = authService.getToken();

  //verifica se o token existe e adiciona ao header da requisição
  if(token){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`// adiciona o token ao header Authorization
      }
    });

  }

  // Não interceptar a requisição de refresh para evitar loop infinito
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Tenta renovar o token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Se o refresh for bem-sucedido, repete a requisição original com o novo token
            return next(req);
          }),
          catchError(() => {
            // Se o refresh falhar, faz o logout
            authService.logout();
            return EMPTY; // Interrompe a cadeia de observables
          })
        );
      }
      // Para outros erros, apenas propaga o erro
      return throwError(() => error);
    })
  );
 
  
}