import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  passwordForm: FormGroup;
  loading: boolean = false;
  loginTypeUser: string = 'Admin';
  loginURL: string = window.location.origin;
  hideShowForm: boolean = false;
  showGetOtpBtn: boolean = true;
  timer: number = 0;
  intervalRef: any;
  buttonName: string = 'GET OTP';

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _authService: AuthService,
    private dialogRef: MatDialogRef<ForgotPasswordComponent>
  ) {
    this.passwordForm = this.fb.group({
      userId: [null, Validators.required],
      OTP: [null, Validators.required],
      new_password: [null, [Validators.required, 
                            Validators.minLength(6), 
                            Validators.maxLength(12),
                            this.passwordComplexityValidator,
                            this.noSpaceValidator]],
      confirm_password: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    
  }

  getOTP(){
    const userId = (this.passwordForm.value.userId || '').trim();
    if(userId){
      this.loading = true;
      let payload = {
        userId: userId,
        loginTypeUser: this.loginTypeUser,
      };
      this._authService.sendOTP(payload).subscribe(
        (res) => {
          this.startCountdown(); // timer start
          this.hideShowForm = true;
          this.toast.success(res.message);
          this.loading = false;
        },
        (err) => {
          this.loading = false;
          if (err.status === 404) {
            this.toast.error(err.error.message);
          } else {
            this.toast.error(err.error.message);
          }
        }
      );
    }else{
      this.toast.error('Please enter User ID');
      return;
    }
  }

  startCountdown() {
    this.timer = 60;          // 1 minute
    this.showGetOtpBtn = false; // GET OTP hide

    this.intervalRef = setInterval(() => {
      this.timer--;

      if (this.timer <= 0) {
        clearInterval(this.intervalRef);
        this.buttonName = 'Resend OTP';
        this.showGetOtpBtn = true; // GET OTP button show
      }

    }, 1000);
  }

  onlyNumber(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  // Custom validator function inside the component
  passwordComplexityValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%&]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return valid ? null : { passwordComplexity: true };
  }

  noSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && /\s/.test(value)) {
      return { noSpace: true };
    }
    return null;
  }

  onPasswordForm() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
       const newPwdControl = this.passwordForm.get('new_password');

      if (newPwdControl?.errors?.['minlength']) {
        this.toast.error('New password must be at least 6 characters.');
      } else if (newPwdControl?.errors?.['passwordComplexity']) {
        this.toast.error('Password must contain uppercase, lowercase, number, and one of ! @ # $ % &.');
      } else if (newPwdControl?.errors?.['noSpace']) {
        this.toast.error('Password should not contain spaces.');
      }else if (this.passwordForm.get('userId')?.hasError('required') ||
                this.passwordForm.get('OTP')?.hasError('required') ||
                this.passwordForm.get('new_password')?.hasError('required') ||
                this.passwordForm.get('confirm_password')?.hasError('required')) {
        this.toast.error('All fields are required!');
      }
      return;
    }
    
    const userId = (this.passwordForm.value.userId || '').trim();
    const OTP = this.passwordForm.value.OTP;
    const nPwd = this.passwordForm.value.new_password;
    const cPwd = this.passwordForm.value.confirm_password;

    if (nPwd !== cPwd) {
      this.toast.error('New & confirm password do not match!');
      return;
    }

    this.loading = true;
    const encryptedNPassword = CryptoJS.AES.encrypt(nPwd, 'password').toString();
    
    let payload = {
      userId: userId,
      OTP: OTP,
      newPassword: encryptedNPassword,
      loginTypeUser: this.loginTypeUser,
      serverUrl: this.loginURL,
    }

    this._authService.forgotPassword(payload).subscribe(
      (res) => {
        this.toast.success(res.message);
        this.loading = false;
        localStorage.clear();
        this.closePopup();
      },
      (err) => {
        this.loading = false;
        if (err.status === 400) {
          this.toast.error(err.error.message);
        }
        else {
          this.toast.error(err.error.message);
        }
    })
  }

  showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  closePopup() {
    this.dialogRef.close();
  }

}
