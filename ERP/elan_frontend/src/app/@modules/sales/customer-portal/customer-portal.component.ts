import { Component } from '@angular/core';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-customer-portal',
  templateUrl: './customer-portal.component.html',
  styleUrls: ['./customer-portal.component.scss']
})
export class CustomerPortalComponent {

  login_id: any;
  login_id_header: any;
  profileData: any = null;
  creditLimitData: any;
  orderCount: any;
  soData: any;

  constructor(private empService: EmpRegistrationService, private cryptoService: CryptoService, private router: Router
  ) { }

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.login_id_header = loginData.loginID;
    this.login_id = this.cryptoService.decrypt(this.login_id_header);
    this.getDashboard();
  }

  onCustomerDetails(data: any): void {
    if (data) {
      this.profileData = data;
    } else {
      this.profileData = null;
    }
  }

  onCreditLimitDetails(data: any): void {
    if (data) {
      this.creditLimitData = data;
    } else {
      this.creditLimitData = null;
    }
  }

  getDashboard() {
    this.empService.getCustomerDashboard(this.login_id).subscribe((res: any) => {
      let result = res.data?.orderCount;
       this.orderCount = {
        total_order: result.total_order,
        complete_order: result.complete_order,
        pending_order: result.pending_order
      };
    },
      ((err: any) => {
    
      })
    )

    this.empService.getSOListForCustomer(this.login_id, 'dashboard').subscribe((res: any) => {
      this.soData = res.data;
    },
      ((err: any) => {
      this.soData = [];
      })
    )
  }

  viewAll(): void {
    this.router.navigate(['/customer-so-list']);
  }

}