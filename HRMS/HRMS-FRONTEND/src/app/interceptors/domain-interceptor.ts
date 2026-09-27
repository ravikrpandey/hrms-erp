import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DomainInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const domain = localStorage.getItem('domain') || 'dummy';

    // ✅ Attach domain as a header (preferred)
    const modifiedReq = req.clone({
      setHeaders: { 'x-domain': domain },
    });

    return next.handle(modifiedReq);
  }
}
