import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import Swal from 'sweetalert2';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.scss']
})
export class CustomerHeaderComponent implements OnInit, OnChanges {

  @Input() login_id: any;
  @Output() customerDetails = new EventEmitter<any>();
  @Output() creditLimitDetails = new EventEmitter<any>();
  details: any;
  currencySymbols: any;
  hideMenu: boolean = false;

  constructor(private empService: EmpRegistrationService, private router: Router, private cryptoService: CryptoService, 
    private salesService: SalesService
  ) { }

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    if(this.login_id === loginData.loginID) this.hideMenu = true;

    if (this.login_id) {
      this.getDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['login_id'] && changes['login_id'].currentValue) {
      this.getDetails();
    }
  }

  getDetails() {
    const decryptedId = this.cryptoService.decrypt(this.login_id) || '';

    if (!decryptedId) {
      console.warn('Invalid customer id');
      return;
    }

    this.empService.getCustomerByIDForPanel(decryptedId).subscribe({
      next: (res: any) => {
        this.details = res?.data;
        this.customerDetails.emit(this.details);
      },
      error: (err: any) => {
        this.details = [];
        this.customerDetails.emit(null);
        console.log('error', err);
      }
    });

    this.salesService.getCreditLimitById(decryptedId).subscribe({
      next: (response: any) => {
        this.creditLimitDetails.emit(response?.data?.[0] || null);
      },
      error: (err: any) => {
        this.creditLimitDetails.emit(null);
      },
    });
  }

  navigateTo(url: string) {
    this.router.navigate([url])
  }

  isActive(url: string): boolean {
    return this.router.url.includes(url);
  }

  logout(type: any) {
    if(type === 'logout'){
      Swal.fire({
        title: 'Are you sure want to Logout?',
        icon: 'warning',
        showCancelButton: true,

        cancelButtonColor: '#858586',
        confirmButtonColor: '#f44336',
        confirmButtonText: 'Log out',
        cancelButtonText: 'Not Now',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('loginData');
          sessionStorage.removeItem('loginData');
          this.router.navigate(['/auth/login']);
        } 
      });
    }else{
      this.router.navigate(['/auth/login']);
    }
  }

}