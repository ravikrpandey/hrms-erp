import { Component, EventEmitter, Input, OnInit, Output, Injector } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth-material/auth.service';
import * as moment from 'moment';
import * as CryptoJS from 'crypto-js';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangePasswordComponent } from 'src/app/@shared/components/change-password/change-password.component';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { VendorLoginComponent } from '../vendor-login/vendor-login.component';

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

  private dialogOpened = false;
  loginForm: any;
  isLogIn: boolean = false;
  loginData: any;
  loading: boolean = false;
  errorMessage: any;
  wrong: any;
  empMainId: any;
  showLoader: boolean = false;
  isSubmited: boolean = false;
  @Input('config') config: any = {
    type: 1,
    length: 6,
    cssClass: 'custom',
    back: {
      stroke: '#2F9688',
      solid: '#f2efd2',
    },
    font: {
      color: '#000000',
      size: '35px',
    },
  };
  // @Input("config") config: any;
  @Output() captchaCode = new EventEmitter();

  captch_input: any = null;
  code: any = null;
  resultCode: any = null;
  checkCaptchaValue: boolean = false;
  returnUrl: string = 'master/ess/dashboard';

  constructor(
    private fb: FormBuilder,
    private _authService: AuthService,
    private route: Router,
    private toast: ToastrService,
    private _route: ActivatedRoute,
    private accessCtrl: AccessControlService,
    private injector: Injector
  ) {
    this.loginForm = this.fb.group({
      employee_official_email: [
        null,
        [Validators.required, Validators.minLength(3)],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ],
      ],
      captcha: [null],
    });
  }

  ngOnInit(): void {
    // this.captchaGenerate();
    // this.createCaptcha();
    // this._route.queryParams.subscribe((params: any) => {
    //     if (params?.returnUrl) {
    //         this.returnUrl = params.returnUrl;
    //     }
    // });
  }

  get login() {
    return this.loginForm.controls;
  }

  loginFormSubmit() {
    if (this.loginForm.invalid) {
      this.toast.error('Enter an Valid User ID/Password');
      return;
    }

    let obj = this.loginForm.value;

    // if (this.resultCode != obj?.captcha) {
    //     //this.createCaptcha();
    //     this.loginForm?.patchValue({captcha: null})
    //     return this.toast.error('Please enter a valid captcha')
    // }

    this.isSubmited = true;
    this.showLoader = true;

    const encryptedEmail = CryptoJS.AES.encrypt(
      obj?.employee_official_email,
      'email'
    ).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(
      obj?.password,
      'password'
    ).toString();

    let req = {
      encryptedEmail: encryptedEmail,
      encryptedPassword: encryptedPassword,
    };
    this._authService.signIn(req).subscribe(
      (res) => {
        this.showLoader = false;
        this.empMainId = res.employee_id;
        if (!res.hasAccess || !res.employee_id) {
          return;
        }
        const eName = res?.entityList.find(
          (item: { entity_id: any }) =>
            item.entity_id === res?.primary_entity_id
        )?.entity_name;

        localStorage.setItem('EmpMainId', this.empMainId);
        localStorage.setItem('role_master_id', res?.role_master_id);
        localStorage.setItem('role_name', res?.role_name);
        localStorage.setItem('role_code', res?.role_code);
        localStorage.setItem('loginUserType', 'Admin');
        localStorage.setItem('selectedEntityId', res?.primary_entity_id);
        localStorage.setItem('entityList', JSON.stringify(res?.entityList));
        this.route.navigate([this.returnUrl]);
        localStorage.setItem('token', res?.accessToken);
        this.getAllAccess_Modules(res);
        this.handleEmployee_Attendance(res.employee_id);
        localStorage.setItem('financial_id', res?.financeList[0]?.id);
        localStorage.setItem('financialList', JSON.stringify(res?.financeList));

      if (!res.forceReset) {
        this.toast.error('Please change your password before continuing.');
  
        // Dialog instance get
        const dialog = this.injector.get(MatDialog);

        if (!this.dialogOpened) {
          this.dialogOpened = true;

          document.body.style.overflow = 'hidden';
          
          dialog.open(ChangePasswordComponent, {
            disableClose: true,  // BACKDROP CLICK NOT CLOSE POPUP
            width: '100%',
            panelClass: 'no-close-dialog'
          }).afterClosed().subscribe(() => {
            this.dialogOpened = false;
            document.body.style.overflow = 'auto';
          });
        }
        return;
      }
      this.toast.success('Welcome to ' + eName, 'Login Successful');

      },
      (err: HttpErrorResponse) => {
        this.showLoader = false;
        if (err.status === 404) {
          this.toast.error('You have entered an invalid credentials');
        } else {
          this.toast.error(err.error.message);
        }
      }
    );
  }

  getAllAccess_Modules(res: any) {
    this.accessCtrl
      .initializeAccess(
        res.employee_id,
        res.role_master_id,
        res.primary_entity_id
      )
      .subscribe((res: any) => {});
  }

  handleEmployee_Attendance(empId: any) {
    let date = new Date();
    let outDate = moment(date).format('YYYY-MM-DD');
    let outTime = moment(date).format('HH:mm');
    let body: Attendance = {
      employee_id: empId,
      punching_date: outDate,
      punching_time: outTime,
      punching_status: 'IN',
    };

    this._authService.employeeAttendance(body).subscribe(
      (res) => {},
      (err) => {}
    );
  }

  captcha: any;
  yourCaptcha: any;

  captchaGenerate() {
    if (this.loginForm) this.loginForm.captcha = '';
    let numeric = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += numeric[Math.floor(Math.random() * numeric.length)];
    }
    this.yourCaptcha = captcha;
  }

  createCaptcha() {
    switch (this.config.type) {
      case 1:
        let char =
          Math.random().toString(24).substring(2, this.config.length) +
          Math.random().toString(24).substring(2, 4);
        this.code = this.resultCode = char.toUpperCase();
        break;
      case 2: // solve the calculation
    }
    setTimeout(() => {
      let captcahCanvas: any = document.getElementById('captcahCanvas');
      var ctx = captcahCanvas.getContext('2d');
      ctx.fillStyle = this.config.back.solid;
      ctx.fillRect(0, 0, captcahCanvas.width, captcahCanvas.height);

      ctx.beginPath();

      captcahCanvas.style.letterSpacing = 15 + 'px';
      ctx.font = this.config.font.size + ' ' + this.config.font.family;
      ctx.fillStyle = this.config.font.color;
      ctx.textBaseline = 'middle';
      ctx.fillText(this.code, 40, 50);
      if (this.config.back.stroke) {
        ctx.strokeStyle = this.config.back.stroke;
        for (var i = 0; i < 150; i++) {
          ctx.moveTo(Math.random() * 300, Math.random() * 300);
          ctx.lineTo(Math.random() * 300, Math.random() * 300);
        }
        ctx.stroke();
      }
    }, 100);
  }

  // Function to reload captcha
  reloadCaptcha(): void {
    this.createCaptcha();
  }

  // checkCaptcha() {
  // 	if (this.captch_input == this.resultCode) {

  // 		this.checkCaptchaValue = true;
  // 		return true;
  // 	} else {
  // 		this.checkCaptchaValue = false;
  // 		return false;
  // 	}
  // }

  openForgotPopup() {
    const dialog = this.injector.get(MatDialog);

    if (!this.dialogOpened) {
      this.dialogOpened = true;

      document.body.style.overflow = 'hidden';
      
      dialog.open(ForgotPasswordComponent, {
        disableClose: true,
        width: '100%',
        panelClass: 'no-close-dialog'
      }).afterClosed().subscribe(() => {
        this.dialogOpened = false;
        document.body.style.overflow = 'auto';
      });
    }
  }

  openLoginPopup(loginType:any){
     const dialog = this.injector.get(MatDialog);

    if (!this.dialogOpened) {
      this.dialogOpened = true;
      document.body.style.overflow = 'hidden';
      
      dialog.open(VendorLoginComponent, {
        disableClose: true,
        width: '100%',
        panelClass: 'no-close-dialog',
        data: {loginType: loginType}
      }).afterClosed().subscribe(() => {
        this.dialogOpened = false;
        document.body.style.overflow = 'auto';
      });
    }
  }

}
