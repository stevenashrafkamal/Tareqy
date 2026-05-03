import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';
import { withInMemoryScrolling } from '@angular/router';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ 
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top'
    })),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ]
};

