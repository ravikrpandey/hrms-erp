import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { UserData } from 'src/app/@shared/interface/core.interface';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toast: ToastrService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private accessCtrl: AccessControlService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const signInUser: UserData = this.accessCtrl.getUser()!;
    let modifiedReq = request;

    // ============================
    //  ADD TOKEN IN HEADER
    // ============================
    if (signInUser) {
      modifiedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${signInUser.accessToken}`,
          // "x-access-token": signInUser.accessToken        // ⭐ New Token Header
        },
      });
    }

    // ============================
    //  PAGE URL + PAGE NAME
    // ============================
    const currentUrl = this.router.url;
    const pageName = currentUrl.split('/').pop();

    modifiedReq = modifiedReq.clone({
      setParams: {
        page_url: currentUrl,
        page_name: pageName || '',
      },
    });

    // ============================
    //  LOADER HANDLING
    // ============================
    const urlParts = modifiedReq.url.split('/');
    const finalApiEndPoint = urlParts[urlParts.length - 1];

    if (finalApiEndPoint === 'signin') {
      this.commonService.hideLoader();
    } else {
      this.commonService.showLoader();
    }

    // ============================
    //  SEND REQUEST + ERROR HANDLING
    // ============================
    return next.handle(modifiedReq).pipe(
      finalize(() => {
        this.commonService.hideLoader();
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 420 || error.status === 401) {
          Swal.fire({
            icon: 'warning',
            title: error.error.error || "Error",
            text: error.error.message,
            confirmButtonText: 'Login Again',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            this.dialog.closeAll();
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate(['/auth/login']);
          });
        }
        return throwError(() => error);
      })
    );
  }
}
