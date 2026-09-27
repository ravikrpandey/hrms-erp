import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-material/auth.service';
import { HeadService } from '../../@shared/services/head.service';
import moment from 'moment';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss'],
})
export class SsoComponent implements OnInit {
  statusMessage: string = 'Authenticating your session from ERP...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private head: HeadService,
    private toast: ToastrService
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
        if (
          (res.role_menu_access_data &&
            res.role_menu_access_data.length === 0) ||
          !res.role_menu_access_data ||
          !res.employee_id
        ) {
          this.statusMessage = 'No module access found. Redirecting...';
          this.toast.error('No module access found');
          setTimeout(() => this.router.navigate(['/auth/login']), 1500);
          return;
        }

        // Ensure signInUser is saved synchronously
        this.authService.authenticationUser(
          res.employee_official_email,
          res.accessToken,
          res.employee_photo,
          res.first_name,
          res.employee_id,
          res.roles,
          res.role_master_id
        );

        // Save session details
        localStorage.setItem('loginUserDetails', JSON.stringify(res));
        localStorage.setItem('EmpMainId', res.employee_id);
        localStorage.setItem('role_master_id', res?.role_master_id);
        localStorage.setItem('department_id', res?.department_id);
        localStorage.setItem('gender', res?.gender);
        localStorage.setItem('designation', res?.designation);
        localStorage.setItem('location', res?.location);
        localStorage.setItem('marital', res?.marital);
        localStorage.setItem('primary_branch_id', res?.primary_branch_id);
        localStorage.setItem('start_working_date', res?.start_working_date);
        localStorage.setItem('end_date_probation', res?.end_date_probation);

        localStorage.setItem('selectedEntityId', res?.primary_entity_id);
        localStorage.setItem('entityList', JSON.stringify(res?.entityList));
        localStorage.setItem(
          'full_name',
          JSON.stringify(res?.first_name + ' ' + res?.last_name)
        );

        res.entity_id =
          res?.primary_entity_id ||
          (res?.entityList && res?.entityList[0]?.entity_id);

        this.head.loginIn.next(true);
        localStorage.setItem('token', 'true');
        this.head.nav.next(false);
        this.head.clicked.next(false);

        this.handleEmployee_Attendance(res.employee_id);

        this.statusMessage = 'Loading dashboard...';

        this.authService.getAllAccess_Modules(res).subscribe({
          next: () => {
            this.toast.success('Welcome to Zyno HRMS', 'Login Successful');
            this.router.navigate(['/master/ess/dashboard']);
          },
          error: (err: any) => {
            console.warn('HRMS module fetch warning:', err);
            this.toast.success('Welcome to Zyno HRMS', 'Login Successful');
            this.router.navigate(['/master/ess/dashboard']);
          },
        });
      },
      error: (err: any) => {
        console.error('HRMS SSO login failed:', err);
        this.statusMessage = 'Authentication failed. Redirecting...';
        this.toast.error(
          err?.error?.message ||
            'Invalid or expired SSO token. Please log in again.'
        );
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
    });
  }

  private handleEmployee_Attendance(empId: any): void {
    let date = new Date();
    let body: any = {
      employee_id: empId,
      punching_date: moment(date).format('YYYY-MM-DD'),
      punching_time: moment(date).format('HH:mm'),
      punching_status: 'IN',
    };

    this.authService.employeeAttendance(body).subscribe();
  }
}
