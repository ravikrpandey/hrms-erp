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

    // Always attach the domain as a header
    let modifiedReq = req.clone({
      setHeaders: { 'x-domain': domain },
    });

    // Add params if both entityType and financialYear are available
    if (entityType && financialYear) {
      const existingParams = modifiedReq.params.keys().reduce((acc, key) => {
        acc[key] = modifiedReq.params.get(key)!;
        return acc;
      }, {} as Record<string, string>);

      modifiedReq = modifiedReq.clone({
        setParams: {
          ...existingParams,
          entityType,
          financialYear,
        },
      });
    }

    return next.handle(modifiedReq);
  }
}
