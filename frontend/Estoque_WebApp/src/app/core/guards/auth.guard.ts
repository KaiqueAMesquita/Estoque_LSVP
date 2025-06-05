import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthenticationService);
    const router = inject(Router);

    const isAuth = auth.isAuthenticated();

    if (!isAuth) {
        return router.createUrlTree(['/login']);
    }

    return true;
};