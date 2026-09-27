import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
@Component({
  selector: 'app-vendor-login',
  templateUrl: './vendor-login.component.html',
  styleUrls: ['./vendor-login.component.scss'],
})
export class VendorLoginComponent {
  loginForm: FormGroup;
  loginTypeUser: string = '';
  loading: boolean = false;
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
    private route: Router,
    private cryptoService: CryptoService,
    private dialogRef: MatDialogRef<VendorLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loginForm = this.fb.group({
      userId: [null, Validators.required],
      OTP: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loginTypeUser = this.data.loginType;
  }

  getOTP(){
    const userId = (this.loginForm.value.userId || '').trim();
    if(userId && this.loginTypeUser){
      this.loading = true;
      let payload = {
        userId: userId,
        loginTypeUser: this.loginTypeUser,
      };
      
      this._authService.customerVendorSendOTP(payload).subscribe(
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
      this.toast.error('Please enter Email ID');
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

  onloginForm() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      if (this.loginForm.get('userId')?.hasError('required') || this.loginForm.get('OTP')?.hasError('required')) {
        this.toast.error('Please enter Email ID and OTP.');
      }
      return;
    }
    
    const userId = (this.loginForm.value.userId || '').trim();
    const OTP = this.loginForm.value.OTP;
  
    this.loading = true;
    
    let payload = {
      userId: userId,
      OTP: OTP,
      loginTypeUser: this.loginTypeUser
    }

    this._authService.customerVendorLogin(payload).subscribe(
    (res) => {

      this.loading = false;
      this.toast.success(res.message);

      if (res?.data) {
        const encryptedId = this.cryptoService.encrypt(res?.data?.id);

        const loginData = {
          loginType: this.loginTypeUser,
          loginID: encryptedId,
          loginToken: res?.data?.token
        };

        localStorage.setItem('loginData', JSON.stringify(loginData));
        this.closePopup();

        if (this.loginTypeUser == 'VENDOR') {
          this.route.navigate(['vendor-dashboard']);
        } else if (this.loginTypeUser == 'CUSTOMER') {
          this.route.navigate(['customer-portal']);
        }
      }
    },
    (err) => {
      this.loading = false;
      this.toast.error(err.error.message);
    }
  );
  }

  closePopup() {
    this.dialogRef.close();
  }

}