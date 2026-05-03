import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/auth/login']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return true;
  router.navigate(['/home']);
  return false;
};

export const roleGuard = (allowed: string[]): CanActivateFn => () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  if (allowed.includes(auth.getRole())) return true;
  router.navigate(['/home']);
  return false;
};

/**
 * adminGuard — blocks anyone whose role is not 'admin' or 'superAdmin'.
 * Requires the user to be authenticated first (use after authGuard).
 * On failure: redirects to /home.
 */
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const role   = auth.getRole();

  console.log('[adminGuard] Attempting access. User role is:', role);

  if (auth.isLoggedIn() && (role === 'admin' || role === 'superAdmin')) {
    console.log('[adminGuard] Access GRANTED. Entering Admin Dashboard.');
    return true;
  }
  
  console.warn('[adminGuard] Access DENIED. Redirecting to /home.');
  router.navigate(['/home']);
  return false;
};

/**
 * codeReviewerGuard — allows only codeReviewer, admin, or superAdmin to enter.
 */
export const codeReviewerGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const role   = auth.getRole();

  if (auth.isLoggedIn() && ['codeReviewer', 'admin', 'superAdmin'].includes(role)) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
