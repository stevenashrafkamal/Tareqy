import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * Auth + Global HTTP Error Interceptor
 *
 * 1. Attaches the Bearer token to every outgoing request (if logged in).
 * 2. Intercepts HTTP error responses and handles them centrally:
 *    - 401 Unauthorized → logs out + redirects to login
 *    - 403 Forbidden    → redirects to home (insufficient role)
 *    - 0 / Network err  → logs a connectivity warning
 *    - 5xx              → logs a server error warning
 *    - All others       → re-throws for the calling service to handle locally
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  const token  = auth.getToken();

  // ── 1. Attach Authorization Header ───────────────────────────────────────
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  // ── 2. Handle HTTP Errors Globally ───────────────────────────────────────
  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 401:
          // Token invalid / expired → clear session and force re-login
          console.warn('[HTTP 401] Unauthorized — clearing session.');
          if (auth.isLoggedIn()) {
            auth.logout();
            router.navigate(['/auth/login']);
          }
          break;

        case 403:
          // Authenticated but wrong role
          console.warn('[HTTP 403] Forbidden — insufficient permissions.');
          if (auth.isLoggedIn()) {
            router.navigate(['/home']);
          }
          break;

        case 0:
          // Network failure (backend down, CORS preflight blocked, etc.)
          console.error('[HTTP 0] Network error — backend unreachable or CORS failure.', err);
          break;

        default:
          if (err.status >= 500) {
            console.error(`[HTTP ${err.status}] Server error:`, err.error?.message ?? err.message);
          }
          // All other errors (400, 404, 422…) are re-thrown for the
          // calling component/service to handle with its own UI feedback.
          break;
      }

      return throwError(() => err);
    })
  );
};
