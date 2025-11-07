import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { Location } from '@angular/common';


export const loginGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthenticationService);// injeta o serviço de autenticação
    const location = inject(Location);//injeta o serviço de localização para navegar de volta
  
    const isAuth = auth.isAuthenticated();// verifica se o usuário está autenticado
    if(isAuth == true){
      location.back();
      return false; // Se já estiver autenticado, não permite acessar a rota de login
    }
    return true;// Permite acessar a rota de login se não estiver autenticado
};
