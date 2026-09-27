import { Component } from '@angular/core';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';
@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent {

  vendor_id: any;
  vendor_id_header: any;

  dashboardData = {
    total_po: 0,
    completed_po: 0,
    inprogress_po: 0,
    return_po: 0,
    live_rfp: 0,
    close_rfp: 0,
    live_nego: 0,
    close_nego: 0
  };

  completionPercentage: number = 0;

  constructor(private poService: PurchaseRequestService, private cryptoService: CryptoService
  ) { }

  ngOnInit(): void {
    const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
    this.vendor_id_header = loginData.loginID;
    this.vendor_id = this.cryptoService.decrypt(this.vendor_id_header);
    this.getVendorDashboard();
  }

  getVendorDashboard() {
    this.poService.getVendorDashboard(this.vendor_id).subscribe((res: any) => {
      let result = res.data;
       this.dashboardData = {
        total_po: result.total_po,
        completed_po: result.completed_po,
        inprogress_po: result.inprogress_po,
        return_po: result.return_po,
        live_rfp: result.live_rfp,
        close_rfp: result.close_rfp,
        live_nego: result.live_nego,
        close_nego: result.close_nego,
      };

      this.calculatePercentage();
    },
      ((err: any) => {
    
      })
    )
  }

  calculatePercentage() {

    if (!this.dashboardData.total_po) {
      this.completionPercentage = 0;
      return;
    }

    this.completionPercentage = Math.round(
      (this.dashboardData.completed_po /
      this.dashboardData.total_po) * 100
    );
  }

}