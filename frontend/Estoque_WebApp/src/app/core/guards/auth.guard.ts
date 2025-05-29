import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthenticationService);

    //redirect To login 
    
    return auth.isAuthenticated();
    
};
