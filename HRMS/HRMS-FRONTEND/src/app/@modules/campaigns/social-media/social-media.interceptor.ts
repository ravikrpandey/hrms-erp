import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable()
export class SocialMediaInterceptor implements HttpInterceptor {
  readonly SOCIAL_API = environment.INQ_API;
  readonly BASE_API = `${environment.serverUrl}`;

  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request URL contains the SOCIAL_API endpoint
    if (request.url.startsWith(this.SOCIAL_API)) {
      return this.handleSocialMediaRequest(request, next);
    } else if (request.url.startsWith(this.BASE_API)) {
      return this.handleBaseApiRequest(request, next);
    } else {
      return next.handle(request);
    }
  }

  handleSocialMediaRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const username = environment.SOCIAL_CLIENT_ID;
    const password = environment.SOCIAL_SECRET;
    // Create authorization header
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
    const modifiedRequest = request.clone({
      setHeaders: {
        'Accept': '*/*',
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      }
    })
    return next.handle(modifiedRequest).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.body?.error) {
          console.error('API Error:', event.body.error);
          throw new Error(event.body.error);
        }
      })
    );
  }
  handleBaseApiRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const signInUser = localStorage.getItem('signInUser') || '';
    let loginUser;
    try {
      loginUser = JSON.parse(signInUser);
    } catch (error) {
      console.error('Failed to parse login user from localStorage:', error);
      loginUser = {};
    }
    const modifiedRequest = request.clone({
      headers: request.headers.append(
        'authorization', `Bearer ${loginUser._token}`
      )
    })
    console.log("BaseApiInterceptor", { modifiedRequest })
    return next.handle(modifiedRequest).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.body && event.body.error) {
          throw new Error(event.body.error);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // console.error(error);
        return throwError(() => error.error)
      })
    );

  }
  }
