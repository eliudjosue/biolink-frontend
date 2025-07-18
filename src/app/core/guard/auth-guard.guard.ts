import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { map } from 'rxjs';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.token$.pipe(
    map(token => token ? true : router.createUrlTree(['/login']))
  );
};
