import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { Location } from '@angular/common';


export const loginGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthenticationService);
    const location = inject(Location);
  
    const isAuth = auth.isAuthenticated();
    if(isAuth == true){
      location.back();
      return false; // Se já estiver autenticado, não permite acessar a rota de login
    }
  return true;
};
