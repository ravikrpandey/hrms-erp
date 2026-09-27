import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { getCurrencySymbol } from '@angular/common';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-top-header',
  templateUrl: './vendor-header.component.html',
  styleUrls: ['./vendor-header.component.scss'],
})
export class VendorTopHeaderComponent implements OnInit, OnChanges {
  @Input() vendor_id: any;
  @Input() po_id: any;

  vendorDetails: any;
  currencySymbols: any;
  hideMenu: boolean = false;
  @Output() onVendorData = new EventEmitter<any>();

  constructor(
    private vendorService: VendorManagementService,
    private router: Router,
    private cryptoService: CryptoService,
  ) {}

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    if (this.vendor_id === loginData.loginID) this.hideMenu = true;

    if (this.vendor_id) {
      this.getVendorDetails();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vendor_id'] && changes['vendor_id'].currentValue) {
      this.getVendorDetails();
    }
  }

  getVendorDetails() {
    const decryptedId = this.cryptoService.decrypt(this.vendor_id) || '';

    if (!decryptedId) {
      console.warn('Invalid vendor id');
      return;
    }

    this.vendorService.getByVendor(decryptedId).subscribe({
      next: (res: any) => {
        this.vendorDetails = res?.data;
        this.onVendorData.emit(this.vendorDetails);
        console.log(this.vendorDetails);

        this.currencySymbols = getCurrencySymbol(
          this.vendorDetails?.symbols,
          'wide',
        );
      },
      error: (err: any) => {
        this.vendorDetails = [];
        console.log('error', err);
      },
    });
  }

  navigateTo(url: string) {
    const queryParams: any = {};

    if (!['/vendor-dashboard', '/vendor-polist'].includes(url)) {
      queryParams.po_id = this.po_id;
      queryParams.vendor_id = this.vendor_id;
    }

    this.router.navigate([url], {
      queryParams,
    });
  }

  isActive(url: string): boolean {
    return this.router.url.includes(url);
  }

  logout(type: any) {
    if (type === 'logout') {
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
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
