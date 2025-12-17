import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthenticationService);

  const token = auth.getToken();
  if (!token) {
    console.error('Acesso negado: Token não encontrado.');
    return false;
  }

  // Certifique-se de que userIsAdmin() está retornando um booleano corretamente
  if (!auth.userIsAdmin()) {
    console.error('Acesso negado: Usuário não é um administrador.');
    return false;
  }

  return true;
};
