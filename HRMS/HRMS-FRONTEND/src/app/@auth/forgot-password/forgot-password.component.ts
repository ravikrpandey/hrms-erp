import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-material/auth.service';
import * as CryptoJS from 'crypto-js';
import { CommonService } from 'src/app/@shared/services/common.service';
import { UserService } from 'src/app/@shared/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  sendLinkForm: any;
  forgotPwdForm: any;
  isLogIn: boolean = false;
  loginData: any;
  loading: boolean = false;
  errorMessage: any;
  wrong: any;
  empMainId: any;
  showLoader: boolean = false;
  isSubmited: boolean = false;
  userId: any;
  baseUiUrl: any;
  showPassword = false;
  showConfirmPassword = false;
  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private toast: ToastrService,
    private $common: CommonService
  ) {
    this.sendLinkForm = this.fb.group({
      employee_official_email: [
        null,
        [Validators.required, Validators.email, Validators.minLength(3)],
      ],
    });
    this.forgotPwdForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
          ),
        ],
      ],
      confirmPwd: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
          ),
        ],
      ],
    });
  }
  ngOnInit(): void {
    this.baseUiUrl = this.$common?.getBaseHref();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.userId = params?.id;
    });
  }

  get formLink() {
    return this.sendLinkForm.controls;
  }
  get forgotPwd() {
    return this.forgotPwdForm.controls;
  }

  sendLinkFormSubmit() {
    try {
      if (this.sendLinkForm.invalid) {
        this.toast.error('Enter a valid e-mail!', 'Something went wrong');
        return;
      }
      this.isSubmited = true;
      this.showLoader = true;
      let obj = this.sendLinkForm.value;
      obj.baseUiUrl = this.baseUiUrl;
      this.userservice.forgotPassSend(obj).subscribe(
        (res) => {
          this.toast.success(res?.message);
          this.showLoader = false;
          this.isSubmited = false;
          this.route.navigateByUrl('auth/login');
        },
        (err) => {
          this.showLoader = false;
          this.isSubmited = false;
          this.toast.error(err?.error?.message);
        }
      );
    } catch (error) {
      this.showLoader = false;
      this.isSubmited = false;
      console.log(error);
    }
  }

  resetPassword() {
    this.isSubmited = true;

    if (this.forgotPwdForm.invalid) {
      return this.toast.warning('Invalid data!');
    }

    const obj = this.forgotPwdForm.value;

    if (obj.password != obj.confirmPwd) {
      return this.toast.error('Password and Confirm Password do not match!');
    }

    try {
      this.showLoader = true;

      const encryptedPassword = CryptoJS.AES.encrypt(
        obj.confirmPwd,
        'password'
      ).toString();

      const req = {
        password: encryptedPassword,
        userId: this.userId,
      };
      this.userservice.resetPassword(req).subscribe(
        (res) => {
          this.toast.success(res.message);
          this.showLoader = false;
          this.route.navigateByUrl('auth/login');
        },
        (err) => {
          this.toast.error('Something went wrong!');
          this.showLoader = false;
        }
      );
    } catch (error) {
      this.toast.error('An unexpected error occurred!');
      this.showLoader = false;
    }
  }
}
