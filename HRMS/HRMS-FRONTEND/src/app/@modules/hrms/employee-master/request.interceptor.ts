import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const domain = localStorage.getItem('domain') || 'dummy';
    const entityType = localStorage.getItem('selectedEntityId');
    const financialYear = localStorage.getItem('financial_id');

    // Always attach x-domain header
    let modifiedReq = req.clone({
      setHeaders: {
        'x-domain': domain,
      },
    });

    // Merge existing query params and add new ones
    const params: Record<string, string> = {};

    // Preserve any existing params in the original request
    modifiedReq.params.keys().forEach(key => {
      const value = modifiedReq.params.get(key);
      if (value) params[key] = value;
    });

    // Add custom params only if available
    if (entityType) params['entityType'] = entityType;
    if (financialYear) params['financialYear'] = financialYear;

    // Clone with updated params if we have any
    if (Object.keys(params).length > 0) {
      modifiedReq = modifiedReq.clone({ setParams: params });
    }

    return next.handle(modifiedReq);
  }
}
