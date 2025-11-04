import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { loaderInterceptor } from 'src/common/interceptor/http.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([loaderInterceptor])
    ),
    provideNativeDateAdapter(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};
