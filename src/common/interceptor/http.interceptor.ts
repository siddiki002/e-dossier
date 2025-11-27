// loader.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize } from 'rxjs/operators';
import { LoaderService } from '../service/loader.service';

const blacklistedUrls: string[] = ["ai-summary", "ping"];

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService);

  if(blacklistedUrls.some(url => req.url.includes(url)) ) {
    return next(req);
  }

  loader.showLoader();

  return next(req).pipe(
    finalize(() => loader.hideLoader())
  );
};