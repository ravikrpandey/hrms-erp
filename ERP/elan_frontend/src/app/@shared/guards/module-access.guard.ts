import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AccessControlService } from '../services/access-control.service';
import { ToastrService } from 'ngx-toastr';

/**
 * Route guard to protect routes based on module access
 * 
 * Usage in routing:
 * {
 *   path: 'employees',
 *   component: EmployeeListComponent,
 *   canActivate: [ModuleAccessGuard],
 *   data: { moduleId: 4 } // or { modulePath: '/hrms/employees' }
 * }
 */
@Injectable({
  providedIn: 'root',
})
export class ModuleAccessGuard implements CanActivate {
  constructor(
    private accessControl: AccessControlService,
    private router: Router,
    private toast: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const moduleId = route.data['moduleId'];
    const modulePath = route.data['modulePath'];
    const requiredPermission = route.data['requiredPermission'] as
      | 'read'
      | 'write'
      | 'delete'
      | undefined;

    // Check by module ID
    if (moduleId) {
      const hasAccess = requiredPermission
        ? this.accessControl.hasPermission(moduleId, requiredPermission)
        : this.accessControl.hasModuleAccess(moduleId);

      if (!hasAccess) {
        this.handleAccessDenied();
        return false;
      }
      return true;
    }

    // Check by module path
    if (modulePath) {
      const hasAccess = this.accessControl.canAccessPath(modulePath);
      if (!hasAccess) {
        this.handleAccessDenied();
        return false;
      }
      return true;
    }

    // If no module specified, allow access
    console.warn('ModuleAccessGuard: No moduleId or modulePath specified in route data');
    return true;
  }

  private handleAccessDenied() {
    this.toast.error('You do not have permission to access this page', 'Access Denied');
    this.router.navigate(['/dashboard']);
  }
}
