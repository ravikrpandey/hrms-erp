import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const signIn: any = localStorage.getItem('signInUser');
    if (!signIn) {
      return next.handle(request);
    }
    try {
      const signInUser = JSON.parse(signIn);
      let token = signInUser?.token || signInUser?._token || signInUser?.accessToken;
      if (!token) {
        const loginDetails = localStorage.getItem('loginUserDetails');
        if (loginDetails) {
          try {
            token = JSON.parse(loginDetails).accessToken;
          } catch (e) {}
        }
      }
      const headers: { [key: string]: string } = {};
      if (token) {
        headers['x-access-token'] = token;
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (signInUser?.employee_id) {
        headers['x-user-id'] = signInUser.employee_id.toString();
      }
      const modifyReq = request.clone({ setHeaders: headers });
      return next.handle(modifyReq);
    } catch (e) {
      return next.handle(request);
    }
 
  }
}
