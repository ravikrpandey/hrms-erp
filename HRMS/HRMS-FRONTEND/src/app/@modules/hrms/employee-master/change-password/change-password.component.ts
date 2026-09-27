import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { UserService } from 'src/app/@shared/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('requiredForm', { static: true }) requiredForm: NgForm;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(
    private location: Location,
    private router: Router,
    private toast: ToastrService,
    private $user: UserService,
    private $common: CommonService
  ) {}

  formData: any = {};
  userLoginId: any;
  baseUiUrl: any;

  ngOnInit() {
    this.baseUiUrl = this.$common?.getBaseHref();
    this.userLoginId = localStorage.getItem('EmpMainId');
  }

  saveRecord() {
    try {
      if (this.formData?.oldPassword === this.formData?.newPassword) {
        return this.toast.error(
          'New password cannot be the same as old password'
        );
      }
      if (this.formData?.newPassword !== this.formData?.confirmPassword) {
        return this.toast.error('Password and confirm password do not match');
      }
      const password = CryptoJS.AES.encrypt(
        this.formData?.confirmPassword,
        'password'
      ).toString();

      let req = {
        employee_id: this.userLoginId,
        password: password,
        oldPassword: this.formData?.oldPassword,
        baseUiUrl: this.baseUiUrl,
      };

      this.$user.changePassword(req).subscribe(
        (response: any) => {
          if (response) {
            this.toast.success(response?.message);
            this.router.navigateByUrl('/auth/login');
          }
        },
        (err) => {
          console.log(err);
          this.toast.error(err?.error?.message || 'Error changing password');
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  goBack() {
    this.location.back();
  }
}
