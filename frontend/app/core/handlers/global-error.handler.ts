import { ErrorHandler, Injectable, NgZone } from '@angular/core';

/**
 * GlobalErrorHandler — catches ALL uncaught synchronous JS errors
 * and any unhandled Angular component errors that aren't caught
 * by the HTTP interceptor (e.g. template errors, null-reference crashes).
 *
 * Registered in app.config.ts via:
 *   { provide: ErrorHandler, useClass: GlobalErrorHandler }
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone) {}

  handleError(error: unknown): void {
    // Run outside Angular's change detection to avoid infinite loops
    this.zone.runOutsideAngular(() => {
      const message = this.extractMessage(error);
      const stack   = error instanceof Error ? error.stack : undefined;

      // Always log full details to the console for debugging
      console.error('[GlobalErrorHandler] Uncaught error:', { message, stack, raw: error });

      // ── Production-safe user notification ──────────────────────────────
      // Replace this block with your toast / snackbar service if available.
      if (!this.isChunkLoadError(error)) {
        // Silent in production; you can add a toast call here, e.g.:
        // this.toastService.error('An unexpected error occurred. Please refresh.');
      } else {
        // Chunk-load failures (lazy-loaded routes) → force a page refresh
        console.warn('[GlobalErrorHandler] Chunk load failure detected — reloading page.');
        window.location.reload();
      }
    });
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private extractMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    try { return JSON.stringify(error); } catch { return 'Unknown error'; }
  }

  /** Detects errors caused by failed lazy-loaded chunk requests. */
  private isChunkLoadError(error: unknown): boolean {
    const msg = this.extractMessage(error).toLowerCase();
    return msg.includes('loading chunk') || msg.includes('chunkloaderror');
  }
}
