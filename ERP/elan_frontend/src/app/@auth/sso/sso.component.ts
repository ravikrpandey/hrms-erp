import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-material/auth.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss'],
})
export class SsoComponent implements OnInit {
  statusMessage = 'Authenticating your session from HRMS...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService,
    private accessCtrl: AccessControlService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (!token) {
        this.statusMessage = 'Invalid SSO request. Redirecting...';
        this.toast.error('SSO token is missing');
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
        return;
      }

      this.processSsoLogin(token);
    });
  }

  private processSsoLogin(token: string): void {
    this.authService.ssoLogin({ token }).subscribe({
      next: (res: any) => {
        if (!res.hasAccess || !res.employee_id) {
          this.statusMessage = 'Access denied. Redirecting...';
          this.toast.warning(
            'Sorry, You do not have access to any modules in ERP',
            'Access Denied'
          );
          setTimeout(() => this.router.navigate(['/auth/login']), 1500);
          return;
        }

        const eName =
          res?.entityList?.find(
            (item: { entity_id: any }) => item.entity_id === res?.primary_entity_id
          )?.entity_name || 'ERP';

        localStorage.setItem('EmpMainId', res.employee_id);
        localStorage.setItem('role_master_id', res?.role_master_id);
        localStorage.setItem('role_name', res?.role_name);
        localStorage.setItem('role_code', res?.role_code);
        localStorage.setItem('loginUserType', 'Admin');
        localStorage.setItem('selectedEntityId', res?.primary_entity_id);
        localStorage.setItem('entityList', JSON.stringify(res?.entityList));
        localStorage.setItem('token', res?.accessToken);
        localStorage.setItem('financial_id', res?.financeList?.[0]?.id || '');
        localStorage.setItem('financialList', JSON.stringify(res?.financeList || []));

        this.statusMessage = 'Loading workspace...';

        this.accessCtrl
          .initializeAccess(
            res.employee_id,
            res.role_master_id,
            res.primary_entity_id
          )
          .subscribe({
            next: () => {
              this.toast.success('Welcome to ' + eName, 'Login Successful');
              this.router.navigate(['/master/ess/dashboard']);
            },
            error: (err) => {
              console.warn('Access initialization warning:', err);
              this.toast.success('Welcome to ' + eName, 'Login Successful');
              this.router.navigate(['/master/ess/dashboard']);
            },
          });
      },
      error: (err: any) => {
        console.error('SSO login failed:', err);
        this.statusMessage = 'Authentication failed. Redirecting...';
        this.toast.error(
          err?.error?.message || 'Invalid or expired SSO token. Please log in again.'
        );
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
    });
  }
}

