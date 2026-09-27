import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import {
  Attendance,
  EntityList,
  FinanceList,
  UserContext,
  UserData,
} from 'src/app/@shared/interface/core.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  userContext: UserContext;
  financial_id: number;
  selectedEntity: number;
  userData: UserData;
  baseUrl = environment.servralUrl;
  currencyList: any;
  page: boolean=false;
  constructor(
    private accesCtrl: AccessControlService,
    private route: Router,
    private authservice: AuthService,
    private configMaster: ConfigurationalmasterService,
  ) {
    this.userContext = this.accesCtrl.getUserContext();
    this.financial_id = this.userContext.financialId;
    this.selectedEntity = this.userContext.entityId;
    this.userData = accesCtrl.getUser()!;
    // console.log(this.financial_id,'financial_id')
    // console.log(this.userData,'userData')
    this.getCurrency();
  }
  selectedCurrencyId: any;
  pendingCurrencyId: any;

  ngOnInit() {
    // this.selectedCurrencyId = 1
    this.configMaster.currencyData.subscribe((data: any) => {
      if (!data) return;
      
      this.page = data?.page=='invoice'?true:false;

      this.pendingCurrencyId = data.currency_id;

      if (this.currencyList?.length) {
        this.selectedCurrencyId = this.pendingCurrencyId;
        const currency = this.currencyList.find(
          (x: any) => x.Currency_Convert_id == this.pendingCurrencyId,
        );
        this.onCurrencyChange(currency);
      }
    });

    console.log(this.userData.financeList, 'finacial');
  }
  toggleMenu() {
    const left = document.querySelector('.left_nav_bar')!;
    const right = document.querySelector('.right_side_data')!;
    left.classList.toggle('x-menu-left');
    right.classList.toggle('x-bar-right');
  }

  selectEntity(e: any) {
    localStorage.setItem('selectedEntityId', e?.value);
    this.accesCtrl.initializeAccess(
      this.userData.employee_id,
      this.userData.role_master_id,
      e.value,
    );
    location.reload();
  }

  getFinancialId(event: any) {
    localStorage.setItem('financial_id', event?.value);
    location.reload();
  }

  handleEmployee_Attendance(empId: any) {
    let date = new Date();
    let outDate = moment(date).format('YYYY-MM-DD');
    let outTime = moment(date).format('HH:mm');

    let body: Attendance = {
      employee_id: empId,
      punching_date: outDate,
      punching_time: outTime,
      punching_status: 'OUT',
    };
    this.authservice.employeeAttendance(body).subscribe(
      (res) => { },
      (err) => { },
    );
  }

  changePassword() {
    this.route.navigate(['master/change-password']);
  }

  onLogout() {
    Swal.fire({
      title: 'Are you sure want to Logout?',
      icon: 'warning',
      showCancelButton: true,

      cancelButtonColor: '#858586',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Log out',
      cancelButtonText: 'Not Now',
    }).then((result) => {
      if (result.value) {
        this.handleEmployee_Attendance(this.userData.employee_id);

        this.authservice.logoutAPI().subscribe(
          (res) => {
            /*clear cache after logout*/
            localStorage.clear();
            sessionStorage.clear();
            this.route.navigate(['/auth/login']);
          },
          (err) => {
            localStorage.clear();
            sessionStorage.clear();
            this.route.navigate(['/auth/login']);
          },
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  seeProfile(path: any) {
    Swal.fire({
      title: 'My Profile',
      html: `
          <div style="text-align: left; font-size: 16px;">
            ${this.userData?.employee_code
          ? `<p><strong>Employee Code:</strong> ${this.userData?.employee_code}</p>`
          : ''
        }
            <p><strong>Employee Name:</strong> ${(this.userData?.title ? this.userData?.title : '') +
        ' ' +
        this.userData?.first_name +
        ' ' +
        this.userData?.last_name
        }</p>
            <p><strong>Email ID:</strong> ${this.userData?.employee_official_email
        }</p>
            <p><strong>Contact Number:</strong> ${this.userData?.contact_number
        }</p>
          </div>
        `,
      confirmButtonColor: '#858586',
      confirmButtonText: 'OK',
    });
  }

  onImageError(event: any) {
    event.target.src = '../../../../../../assets/profile-icon.png';
  }

  getCurrency() {
    this.configMaster.CurrencyList().subscribe({
      next: (res: any) => {
        this.currencyList = res.data;
        this.configMaster.setCurrencyData(this.currencyList);
        const currency = this.currencyList.find(
          (x: any) => x.Currency_Type == 'INR',
        );
        this.onCurrencyChange(currency);
      },
      error: (err) => {
        console.log('error', err.error.message);
      },
    });
  }
  onCurrencyChange(currency: any) {
    this.selectedCurrencyId = this.pendingCurrencyId
      ? this.pendingCurrencyId
      : currency.Currency_Convert_id;
    this.configMaster.changeCurrency(currency);
  }

  get isShowCurrency() {
    const includedRoutes = ['/master/finance', '/master/sales'];
    const currentRoute = this.route.url;
    return includedRoutes.some((route) => currentRoute.startsWith(route));
  }
}
