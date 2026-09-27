import { Component, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  passwordForm: FormGroup;
  loading: boolean = false;
  loginId: any;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private _authService: AuthService,
    private route: Router,
    @Optional() public dialogRef?: MatDialogRef<ChangePasswordComponent>,
  ) {
    this.passwordForm = this.fb.group({
      old_password: [null, Validators.required],
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
      }else if (this.passwordForm.get('old_password')?.hasError('required') ||
                this.passwordForm.get('new_password')?.hasError('required') ||
                this.passwordForm.get('confirm_password')?.hasError('required')) {
        this.toast.error('All fields are required!');
      }
      return;
    }

    const oPwd = this.passwordForm.value.old_password?.trim();
    const nPwd = this.passwordForm.value.new_password?.trim();
    const cPwd = this.passwordForm.value.confirm_password?.trim();

    if (nPwd !== cPwd) {
      this.toast.error('New & confirm password do not match!');
      return;
    }

    this.loading = true;
    const encryptedOPassword = CryptoJS.AES.encrypt(oPwd, 'password').toString();
    const encryptedNPassword = CryptoJS.AES.encrypt(nPwd, 'password').toString();
    
    let payload = {
      oldPassword: encryptedOPassword,
      newPassword: encryptedNPassword,
      loginTypeUser: localStorage.getItem('loginUserType'),
      serverUrl: window.location.origin,
    }

    this._authService.changePassword(payload).subscribe(
      (res) => {
        this.toast.success(res.message);
        this.loading = false;
        localStorage.clear();

        if (this.dialogRef) {
          this.dialogRef.close('success');
        }
        this.route.navigate(['auth/login']);
      },
      (err) => {
        this.loading = false;
        if (err.status === 404) {
          this.toast.error(err.error.message);
        }
        else {
          this.toast.error(err.error.message);
        }
    })
  }

  resetPaasowrd() {
    this.loading = false;
    this.passwordForm.reset();
  }

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
