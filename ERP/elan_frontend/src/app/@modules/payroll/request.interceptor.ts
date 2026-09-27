import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const entityType = localStorage.getItem('selectedEntityId');
    const financialYear = localStorage.getItem('financial_id');

    if (entityType && financialYear) {
      const clonedRequest = req.clone({
        setParams: {
          entityType: entityType,
          financialYear: financialYear
        }
      });

      return next.handle(clonedRequest);
    }

    return next.handle(req);
  }
}
