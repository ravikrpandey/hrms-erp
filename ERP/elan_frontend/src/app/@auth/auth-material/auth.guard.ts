import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Route,
  Router,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private auth: AuthService,
    private access: AccessControlService,
    private toast: ToastrService
  ) {}

  // ----------------------------------------------------------------------
  // CAN LOAD (lazy modules)
  // ----------------------------------------------------------------------
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const fullPath = segments.map((s) => s.path).join('/'); // e.g. master/leads/list
    return this.validateAccess(fullPath);
  }

  // ----------------------------------------------------------------------
  // CAN ACTIVATE (normal route guard)
  // ----------------------------------------------------------------------
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const requestedUrl = state.url.replace('/master/', '').trim();
    // Example: master/leads/list → leads/list

    return this.validateAccess(requestedUrl);
  }

  // ----------------------------------------------------------------------
  // CENTRAL ACCESS VALIDATION
  // ----------------------------------------------------------------------
  private validateAccess(requestedPath: string): Observable<boolean> {
    const signIn = localStorage.getItem('signInUser');

    if (!signIn) {
      this.toast.error('Session expired');
      this.router.navigate(['/auth/login']);
      return of(false);
    }

    // Example: requestedPath = "leads/list"
    const hasPermission = this.access.canRead(requestedPath);
    if (hasPermission) {
      return of(true);
    }

    this.toast.error('Access Denied');
    this.router.navigate(['/access-denied']);
    return of(false);
  }
}
