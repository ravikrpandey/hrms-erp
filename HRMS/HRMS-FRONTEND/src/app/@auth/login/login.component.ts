import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeadService } from '../../@shared/services/head.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-material/auth.service';
import moment from 'moment';
import * as CryptoJS from 'crypto-js';

interface Attendance {
  employee_id: string;
  punching_date: string;
  punching_time: string;
  punching_status: 'IN';
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any;
  empMainId: any;
  showLoader: boolean = false;
  isSubmited: boolean = false;

  constructor(
    private fb: FormBuilder,
    private head: HeadService,
    private _authService: AuthService,
    private route: Router,
    private toast: ToastrService
  ) {
    this.loginForm = this.fb.group({
      employee_official_email: [null],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      domain: ['kiranautomation', Validators.required],
    });
  }

  ngOnInit(): void {}

  get login() {
    return this.loginForm.controls;
  }

  loginFormSubmit() {
    if (this.loginForm.invalid) {
      this.toast.error('Enter a Valid Email/Password', 'Something Went Wrong');
      return;
    }

    this.isSubmited = true;
    this.showLoader = true;

    const obj = this.loginForm.value;

    const encryptedEmail = CryptoJS.AES.encrypt(
      obj?.employee_official_email,
      'email'
    ).toString();

    const encryptedPassword = CryptoJS.AES.encrypt(
      obj?.password,
      'password'
    ).toString();

    const domain = obj?.domain || 'kiranautomation';

    localStorage.setItem('domain', domain);

    const req = {
      encryptedEmail,
      encryptedPassword,
    };

    this._authService.signIn(req).subscribe(
      (res) => {
        this.showLoader = false;

        this.empMainId = res.employee_id;

        if (
          (res.role_menu_access_data &&
            res.role_menu_access_data.length === 0) ||
          !res.role_menu_access_data ||
          !res.employee_id
        ) {
          this.toast.error('No module access found');
          return;
        }

        localStorage.setItem('loginUserDetails', JSON.stringify(res));

        const signInObj = {
          employee_official_email: res.employee_official_email,
          _token: res.accessToken,
          token: res.accessToken,
          accessToken: res.accessToken,
          employee_photo: res.employee_photo,
          first_name: res.first_name,
          last_name: res.last_name,
          employee_id: res.employee_id,
          role: res.roles,
          role_name: res.roles,
          roles: res.roles,
          role_id: res.role_master_id,
          role_master_id: res.role_master_id,
          role_master_name: res.roles
        };
        localStorage.setItem('signInUser', JSON.stringify(signInObj));

        this.toast.success('Welcome to Kiran Automation HRMS', 'Login Successful');

        // Save user details
        localStorage.setItem('EmpMainId', this.empMainId);
        localStorage.setItem('role_master_id', res?.role_master_id);
        localStorage.setItem('department_id', res?.department_id);
        localStorage.setItem('gender', res?.gender);
        localStorage.setItem('designation', res?.designation);
        localStorage.setItem('location', res?.location);
        localStorage.setItem('marital', res?.marital);
        localStorage.setItem('primary_branch_id', res?.primary_branch_id);
        localStorage.setItem('start_working_date', res?.start_working_date);
        localStorage.setItem('end_date_probation', res?.end_date_probation);

        localStorage.setItem(
          'selectedEntityId',
          res?.primary_entity_id
        );

        localStorage.setItem(
          'entityList',
          JSON.stringify(res?.entityList)
        );

        localStorage.setItem(
          'full_name',
          JSON.stringify(res?.first_name + ' ' + res?.last_name)
        );

        res.entity_id = res?.primary_entity_id || (res?.entityList && res?.entityList[0]?.entity_id);

        this.route
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.route.navigate(['master/ess/dashboard']).then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 100);
            });
          });

        this.head.loginIn.next(true);
        localStorage.setItem('token', 'true');
        this.head.nav.next(false);
        this.head.clicked.next(false);

        this.getAllAccess_Modules(res);
        this.handleEmployee_Attendance(res.employee_id);
      },
      (err) => {
        this.showLoader = false;

        if (err.status === 404) {
          this.toast.error('Invalid credentials');
        } else {
          this.toast.error('Invalid User & Password!', 'Error');
        }
      }
    );
  }

  getAllAccess_Modules(res: any) {
    this._authService.getAllAccess_Modules(res).subscribe();
  }

  handleEmployee_Attendance(empId: any) {
    let date = new Date();
    let body: Attendance = {
      employee_id: empId,
      punching_date: moment(date).format('YYYY-MM-DD'),
      punching_time: moment(date).format('HH:mm'),
      punching_status: 'IN',
    };

    this._authService.employeeAttendance(body).subscribe();
  }
}