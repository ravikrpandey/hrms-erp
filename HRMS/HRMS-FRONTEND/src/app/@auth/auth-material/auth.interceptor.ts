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

    const signIn:any = localStorage.getItem('signInUser');
    const singInUser = JSON.parse(signIn);

    if(!singInUser){
      return next.handle(request);
    }else{
      const modifyReq = request.clone({
        // setHeaders: { Authorization: `Bearer ${singInUser._token}`}
      })
      return next.handle(modifyReq)
    }
 
  }
}
