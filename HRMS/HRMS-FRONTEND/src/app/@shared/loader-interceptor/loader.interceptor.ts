import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private spinner: NgxSpinnerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     
    const isLoginRequest = request.url.includes('/signin');   
    const isAttendanceRequest =
      request.url.includes('/attendance/') ||
      request.url.includes('verified_punch') ||
      request.url.includes('enroll_face') ||
      request.url.includes('face_status') ||
      request.url.includes('create_DAILY_attendance') ||
      request.url.includes('get_DAILY_attendance') ||
      request.headers.has('x-skip-loader');

    const shouldSkipLoader = isLoginRequest || isAttendanceRequest;

    if (!shouldSkipLoader) {
      this.spinner.show();
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (!shouldSkipLoader) {
          this.spinner.hide();
        }
      })
    );
  }
}

