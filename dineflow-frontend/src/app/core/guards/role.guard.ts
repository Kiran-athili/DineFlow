import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

export const roleGuard: CanActivateFn = (route) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  const expectedRoles = route.data?.['roles'] as string[];

  const userRole = tokenStorage.getRole();

  if (!tokenStorage.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (expectedRoles && userRole && expectedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};