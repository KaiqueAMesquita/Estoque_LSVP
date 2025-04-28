import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AuthenticationService } from '../authentication/authentication.service';
import { inject } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService); // Injeta o serviço de autenticação
  const http = inject(HttpClient);
  const accessToken = authService.getToken(); // Obtém o token
  //refresh = false;

  if (accessToken) {
    const modifiedReq = req.clone({
      setHeaders: {
        authorization: `Bearer ${accessToken}`//coloca o token no header das paginas
      }
    });
    return next(modifiedReq); // Passa a requisição modificada para o próximo interceptor
  }

  return next(req).pipe(catchError((err: HttpErrorResponse) =>{

    // TODO: Quando houver rotas
    // if(err.status == 401 && !this.refresh){
    //   this.refresh = true;
    //   return this.http.post('req', {}, {withCredential: true}).pipe(
    //     switchMap((res: any) =>{
    //     authService.setToken(res.token);
    //     return next.handle(req.clone({
    //       setHeaders: {
    //         authorization: `Bearer ${accessToken}`//coloca o token no header das paginas
    //       }
    //     }))
    //     });
    //   )
    // }
    // this.refresh = false;
    return throwError(() => err);
  } ));
}