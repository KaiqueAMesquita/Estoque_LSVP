import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthenticationService);// Injeta o serviço de autenticação
    const router = inject(Router); // Injeta o serviço de roteamento
    const isAuth = auth.isAuthenticated(); // Verifica se o usuário está autenticado

    // Se não estiver autenticado, redireciona para a página de login
    if (!isAuth) {
        return router.createUrlTree(['/login']);
    }

    // Se estiver autenticado, permite o acesso à rota
    return true;
};