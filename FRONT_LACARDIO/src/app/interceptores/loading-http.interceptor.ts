import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxUiLoaderHttpModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';

export const loadingHttpInterceptor: HttpInterceptorFn = (req, next) => {

  NgxUiLoaderHttpModule.forRoot({
    exclude: [
      "/NEXOback/usuariosNEXO/",
    ],
  });
  // Obtén el servicio del cargador usando un inyectable de `NgxUiLoaderService`
  const ngxUiLoaderService = inject(NgxUiLoaderService);

  // Inicia el cargador
  ngxUiLoaderService.start();

  // Maneja la solicitud y detiene el cargador cuando la solicitud finaliza
  return next(req).pipe(
    finalize(() => ngxUiLoaderService.stop())
  );
};
