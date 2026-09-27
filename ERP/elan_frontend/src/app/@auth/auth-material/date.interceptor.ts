import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalDateService } from '../../@shared/services/service/global-date.service';

@Injectable()
export class DateInterceptor implements HttpInterceptor {
  constructor(private dateService: GlobalDateService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to modify it
    const clonedReq = req.clone({
      body: this.transformDates(req.body)
    });

    return next.handle(clonedReq);
  }

  private transformDates(body: any): any {
    if (body && typeof body === 'object') {
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          if (body[key] instanceof Date) {
            body[key] = this.dateService.toUTC(body[key]);
          } else if (typeof body[key] === 'object') {
            // Recursively process nested objects
            body[key] = this.transformDates(body[key]);
          }
        }
      }
    }
    return body;
  }
}
