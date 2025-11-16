import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingHttpInterceptor } from './interceptores/loading-http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
     provideHttpClient(
      withInterceptors([
        loadingHttpInterceptor,
      ])
    ),
    importProvidersFrom(
      NgxUiLoaderModule.forRoot({
        bgsColor: "#a40a33ff",   // Fondo del loader (background spinner)
        pbColor: "#a40a33ff",    // Barra de progreso
        fgsColor: "#a40a33ff",   // Spinner principal (foreground spinner)
        fgsType: "rectangle-bounce", // Tipo de animación opcional
        bgsType: "square-jelly-box", // Tipo de animación del fondo
        pbThickness: 4, // grosor de la barra
        hasProgressBar: true, // mostrar barra
      })
    ),

  ]
};
